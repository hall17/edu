import { HTTP_EXCEPTIONS } from '@api/constants';
import { env } from '@api/env';
import { CustomError } from '@api/types';
import { getSignedCookies, getSignedUrl } from '@aws-sdk/cloudfront-signer';
import AWS from 'aws-sdk';

import { cacheManager } from './cacheManager';
import { logger } from './logger';

export interface CookiesData {
  [key: string]: {
    value: string;
    options?: object;
  };
}

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
  'assessments',
  'materials',
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
  key: string
): Promise<S3ObjectMetadata | null> {
  if (!key) {
    throw new CustomError(HTTP_EXCEPTIONS.BAD_REQUEST);
  }

  try {
    const metadata = await retryS3Operation(async () => {
      return s3
        .headObject({
          Bucket: env.AWS_S3_BUCKET_NAME,
          Key: key,
        })
        .promise();
    }, 'S3 headObject');

    const result = {
      size: metadata.ContentLength,
      lastModified: metadata.LastModified,
      contentType: metadata.ContentType,
      etag: metadata.ETag,
    };

    logger.info(`Successfully retrieved metadata for: ${key}`);
    return result;
  } catch (error) {
    if ((error as any).code === 'NotFound') {
      logger.warn(`Object not found: ${key}`);
    }
    logger.error(
      `Failed to get metadata for ${key}: ${(error as Error).message}`
    );

    return null;
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

const cookiesOptions = {
  domain: 'edusama.com',
  secure: true,
  path: '/',
  sameSite: 'none',
};

export async function getSignedUrlCloudfront(s3FileKey: string) {
  let url = `${env.AWS_CF_DISTRIBUTION_DOMAIN}/${encodeURI(s3FileKey)}`; // master .m3u8 file (HLS playlist)
  url = `${env.AWS_CF_DISTRIBUTION_DOMAIN}/hls/output-folder/video2/master.m3u8`;
  return getSignedUrl({
    url,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
    keyPairId: env.AWS_CF_KEY_PAIR_ID,
    privateKey: env.AWS_CF_PRIVATE_KEY,
  });
}

export async function getSignedCookiesForFile(s3FileKey: string) {
  const url = `${env.AWS_CF_DISTRIBUTION_DOMAIN}/hls/output-folder/video2/master.m3u8`;

  // const url = `${cloudfrontDistributionDomain}/${encodeURI(s3FileKey)}`; // master .m3u8 file (HLS playlist)

  const intervalToAddInMs = 86400 * 1000; // 1 day
  const policy = {
    Statement: [
      {
        Resource: `${env.AWS_CF_DISTRIBUTION_DOMAIN}/*`,
        Condition: {
          DateLessThan: {
            'AWS:EpochTime': Math.floor(
              (Date.now() + intervalToAddInMs) / 1000
            ),
          },
        },
      },
    ],
  };

  const policyString = JSON.stringify(policy);
  const cookies = getSignedCookies({
    keyPairId: env.AWS_CF_KEY_PAIR_ID,
    privateKey: env.AWS_CF_PRIVATE_KEY,
    policy: policyString,
  });

  const cookiesResult: CookiesData = {};
  Object.keys(cookies).forEach((key) => {
    // @ts-ignore
    cookiesResult[key] = {
      // @ts-ignore
      value: cookies[key] as any,
      options: cookiesOptions,
    };
  });

  // url = `${cloudfrontDistributionDomain}/hls/output-folder/8255c0b1-17c1-43da-9c80-7790a3a9acf5/master.m3u8`;

  return {
    fileUrl: url, // master playlist url
    cookies: cookiesResult, // cookies for frontend
  };
}
