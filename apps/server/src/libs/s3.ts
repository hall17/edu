import { HTTP_EXCEPTIONS } from '@api/constants';
import { env } from '@api/env';
import { CustomError } from '@api/types';
import AWS from 'aws-sdk';

import { cacheManager } from './cacheManager';
import { logger } from './logger';

const GET_OBJECT_EXPIRES_IN_MS = 28800; // 8 hours
const PUT_OBJECT_EXPIRES_IN_MS = 60; // 1 minute
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_RETRIES = 3;

// Type definitions
const _folderOptions = [
  'profile-pictures',
  'classroom-templates',
  'classrooms',
  'modules',
] as const;
export type FolderOption = (typeof _folderOptions)[number];

export interface SignedUrlOptions {
  expiresInMs?: number;
  contentType?: string;
  maxSize?: number;
}

export interface S3ObjectMetadata {
  size?: number;
  lastModified?: Date;
  contentType?: string;
  etag?: string;
}

export interface BulkDeleteObject {
  companyId: number;
  branchId: number;
  folder: FolderOption;
  key: string;
}

// Environment validation
function validateAwsConfig() {
  const requiredEnvVars = [
    'AWS_S3_ACCESS_KEY_ID',
    'AWS_S3_SECRET_ACCESS_KEY',
    'AWS_S3_REGION',
    'AWS_S3_BUCKET_NAME',
  ] as const;

  const missingVars = requiredEnvVars.filter(
    (varName) => !(env as any)[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required AWS S3 environment variables: ${missingVars.join(', ')}`
    );
  }
}

validateAwsConfig();

// AWS S3 Configuration
AWS.config = new AWS.Config({
  accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  region: env.AWS_S3_REGION,
});

// Utility functions
function buildS3Path(
  companyId: number,
  branchId: number,
  folder: FolderOption | undefined,
  key: string
): string {
  const pathParts = [
    'companies',
    companyId.toString(),
    'branches',
    branchId.toString(),
  ];

  if (folder) {
    pathParts.push(folder);
  }

  pathParts.push(key);
  return pathParts.join('/');
}

function validateInputs(companyId: number, branchId: number, key: string) {
  if (!companyId || companyId <= 0) {
    throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
  }
  if (!branchId || branchId <= 0) {
    throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
  }
  if (!key) {
    throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
  }
}

async function retryS3Operation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      logger.warn(
        `${operationName} failed (attempt ${attempt}/${maxRetries}): ${lastError.message}`
      );

      if (attempt === maxRetries) break;

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  logger.error(
    `${operationName} failed after ${maxRetries} attempts: ${lastError.message}`
  );
  throw new CustomError(HTTP_EXCEPTIONS.INTERNAL_SERVER_ERROR);
}

interface GenerateSignedUrlOptionsBase extends SignedUrlOptions {
  operation: 'getObject' | 'putObject';
}

interface GenerateSignUrlOptionsWithPath extends GenerateSignedUrlOptionsBase {
  path: string;
}

interface GenerateSignUrlOptionsWithoutPath
  extends GenerateSignedUrlOptionsBase {
  companyId: number;
  branchId: number;
  folder?: FolderOption;
  key: string;
}

type GenerateSignedUrlOptions =
  | GenerateSignUrlOptionsWithPath
  | GenerateSignUrlOptionsWithoutPath;

export async function generateSignedUrl(options: GenerateSignedUrlOptions) {
  const { operation } = options;

  let path = '';

  if ('path' in options) {
    if (!options.path) {
      throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
    }
    path = options.path;
  } else {
    const { companyId, branchId, folder, key } = options;
    // Input validation
    validateInputs(companyId, branchId, key);
    path = buildS3Path(companyId, branchId, folder, key);
  }

  // File size validation for uploads
  if (
    operation === 'putObject' &&
    options.maxSize &&
    options.maxSize > MAX_FILE_SIZE
  ) {
    throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
  }

  const expires =
    options.expiresInMs ||
    (operation === 'getObject'
      ? GET_OBJECT_EXPIRES_IN_MS
      : PUT_OBJECT_EXPIRES_IN_MS);

  logger.info(
    `Generating signed URL for operation: ${operation}, path: ${path}`
  );

  // Check cache for getObject operations
  if (operation !== 'putObject') {
    try {
      const cachedUrl = await cacheManager.get(path);
      if (cachedUrl) {
        logger.info(`Returning cached URL for key: ${path}`);
        return cachedUrl as string;
      }
    } catch (cacheError) {
      logger.warn(
        `Cache retrieval failed for key ${path}: ${(cacheError as Error).message}`
      );
    }
  }

  // Generate signed URL with retry logic
  const url = await retryS3Operation(async () => {
    const params: any = {
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: path,
      Expires: expires,
    };

    if (operation === 'putObject' && options.contentType) {
      params.ContentType = options.contentType;
    }

    return s3.getSignedUrlPromise(operation, params);
  }, `S3 ${operation}`);

  // Cache the URL for getObject operations
  if (operation !== 'putObject') {
    try {
      // Fix TTL calculation: expires is in seconds for S3, cache-manager expects milliseconds
      await cacheManager.set(path, url, expires * 1000);
      logger.info(`Cached URL for key: ${path} with TTL: ${expires * 1000}ms`);
    } catch (cacheError) {
      logger.warn(
        `Cache storage failed for key ${path}: ${(cacheError as Error).message}`
      );
    }
  }

  logger.info(`Successfully generated signed URL for ${operation}`);
  return url;
}

export async function deleteS3Object(
  companyId: number,
  branchId: number,
  folder: FolderOption,
  key: string
) {
  validateInputs(companyId, branchId, key);

  const path = buildS3Path(companyId, branchId, folder, key);
  logger.info(`Deleting S3 object: ${path}`);

  const result = await retryS3Operation(async () => {
    return s3
      .deleteObject({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: path,
      })
      .promise();
  }, 'S3 deleteObject');

  // Invalidate cache
  try {
    await cacheManager.del(key);
    logger.info(`Invalidated cache for key: ${key}`);
  } catch (cacheError) {
    logger.warn(
      `Cache invalidation failed for key ${key}: ${(cacheError as Error).message}`
    );
  }

  logger.info(`Successfully deleted S3 object: ${path}`);
  return result;
}

export async function deleteMultipleS3Objects(objects: BulkDeleteObject[]) {
  if (!objects.length) {
    throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
  }

  // Validate all inputs
  objects.forEach((obj, _index) => {
    try {
      validateInputs(obj.companyId, obj.branchId, obj.key);
    } catch {
      throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
    }
  });

  const deleteParams = {
    Bucket: env.AWS_S3_BUCKET_NAME,
    Delete: {
      Objects: objects.map((obj) => ({
        Key: buildS3Path(obj.companyId, obj.branchId, obj.folder, obj.key),
      })),
    },
  };

  logger.info(`Deleting ${objects.length} S3 objects`);

  const result = await retryS3Operation(async () => {
    return s3.deleteObjects(deleteParams).promise();
  }, 'S3 deleteObjects');

  // Invalidate cache for all deleted objects
  const cachePromises = objects.map((obj) => cacheManager.del(obj.key));
  try {
    await Promise.allSettled(cachePromises);
    logger.info(`Invalidated cache for ${objects.length} keys`);
  } catch (cacheError) {
    logger.warn(
      `Some cache invalidations failed: ${(cacheError as Error).message}`
    );
  }

  logger.info(`Successfully deleted ${result.Deleted?.length || 0} S3 objects`);
  return result;
}

export async function deleteS3ObjectByPath(path: string) {
  const result = await retryS3Operation(async () => {
    return s3
      .deleteObject({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: path,
      })
      .promise();
  }, 'S3 deleteObject');

  logger.info(`Successfully deleted S3 object: ${path}`);
  return result;
}

export async function getObjectMetadata(
  companyId: number,
  branchId: number,
  folder: FolderOption | undefined,
  key: string
): Promise<S3ObjectMetadata> {
  validateInputs(companyId, branchId, key);

  const path = buildS3Path(companyId, branchId, folder, key);
  logger.info(`Getting metadata for S3 object: ${path}`);

  try {
    const metadata = await retryS3Operation(async () => {
      return s3
        .headObject({
          Bucket: env.AWS_S3_BUCKET_NAME,
          Key: path,
        })
        .promise();
    }, 'S3 headObject');

    const result = {
      size: metadata.ContentLength,
      lastModified: metadata.LastModified,
      contentType: metadata.ContentType,
      etag: metadata.ETag,
    };

    logger.info(`Successfully retrieved metadata for: ${path}`);
    return result;
  } catch (error) {
    if ((error as any).code === 'NotFound') {
      logger.warn(`Object not found: ${path}`);
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }
    logger.error(
      `Failed to get metadata for ${path}: ${(error as Error).message}`
    );
    throw new CustomError(HTTP_EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
}

export async function checkObjectExists(
  companyId: number,
  branchId: number,
  folder: FolderOption | undefined,
  key: string
): Promise<boolean> {
  try {
    await getObjectMetadata(companyId, branchId, folder, key);
    return true;
  } catch (error) {
    if ((error as CustomError).status === HTTP_EXCEPTIONS.NOT_FOUND.status) {
      return false;
    }
    throw error;
  }
}

export async function invalidateCache(key: string) {
  try {
    await cacheManager.del(key);
    logger.info(`Cache invalidated for key: ${key}`);
  } catch (error) {
    logger.warn(
      `Cache invalidation failed for key ${key}: ${(error as Error).message}`
    );
  }
}
