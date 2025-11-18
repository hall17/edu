import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config({
  path: process.env['NODE_ENV'] ? `.env.${process.env['NODE_ENV']}` : '.env',
});

function parseEnv() {
  const envSchema = z.object({
    NODE_ENV: z.union(
      [z.literal('development'), z.literal('production'), z.literal('test')],
      {
        error:
          'NODE_ENV must be either "development" or "production" or "test"',
      }
    ),
    PORT: z
      .string()
      .min(1)
      .transform(Number)
      .pipe(
        z.number().min(1).max(65535).describe('Port number between 1-65535')
      ),
    DATABASE_URL: z.string().min(1),
    ACCESS_TOKEN_SECRET_KEY: z.string().min(1),
    REFRESH_TOKEN_SECRET_KEY: z.string().min(1),
    LOG_FORMAT: z
      .union([
        z.literal('combined'),
        z.literal('common'),
        z.literal('dev'),
        z.literal('short'),
        z.literal('tiny'),
        z.string(),
      ])
      .default(':method :url :status :response-time ms'),
    LOG_DIR: z.string().min(1).default('../logs'),
    ALLOWED_ORIGINS: z
      .string()
      .min(1)
      .transform((origin) => origin.split(',')),
    BACKEND_URL: z.string().min(1),
    COMMON_RATE_LIMIT_WINDOW_MS: z
      .string()
      .min(1)
      .transform(Number)
      .default(60000),
    COMMON_RATE_LIMIT_MAX_REQUESTS: z
      .string()
      .min(1)
      .transform(Number)
      .default(100),
    PRISMA_LOG_LEVEL: z
      .string()
      .optional()
      .transform((logLevel) => {
        if (!logLevel?.includes('[')) {
          return logLevel;
        }

        // Replace single quotes with double quotes to make valid JSON
        const validJson = logLevel.replace(/'/g, '"');
        return JSON.parse(validJson);
      }),
    ENCRYPTION_KEY: z.string().min(1),
    // Google SMTP Configuration
    SMTP_HOST: z.string().min(1).default('smtp.gmail.com'),
    SMTP_PORT: z
      .string()
      .min(1)
      .transform(Number)
      .pipe(z.number().min(1).max(65535))
      .default(587),
    SMTP_USER: z.string().email(),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM_NAME: z.string().min(1).default('Edusama'),
    SMTP_FROM_EMAIL: z.string().email(),
    FRONTEND_URL: z.string().url(),
    // SMS Configuration
    SMS_API_KEY: z.string().min(1).optional(),
    SMS_API_SECRET: z.string().min(1).optional(),
    SMS_FROM_NAME: z.string().min(1).optional(),
    // AWS S3 Configuration
    AWS_S3_ACCESS_KEY_ID: z.string().min(1),
    AWS_S3_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_S3_REGION: z.string().min(1),
    AWS_S3_BUCKET_NAME: z.string().min(1),
    AWS_CF_PRIVATE_KEY: z.string().min(1),
    AWS_CF_KEY_PAIR_ID: z.string().min(1),
    AWS_CF_DISTRIBUTION_DOMAIN: z.string().min(1),
  });

  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:');
    console.error(
      parsedEnv.error.issues
        .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n')
    );
    throw new Error('Invalid environment variables');
  }

  return parsedEnv.data;
}

export const env = parseEnv();

console.log('env', env);
