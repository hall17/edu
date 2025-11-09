import 'reflect-metadata';
import { logger, stream } from '@api/libs/logger';
import { errorMiddleware } from '@api/middlewares/rest/errorMiddleware';
import * as trpcExpress from '@trpc/server/adapters/express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';

import { Server } from 'http';
import path from 'path';

import { sendAttendanceNotifications } from './crons/sendAttendanceNotifications';
import { env } from './env';
import { createContext } from './trpc';
import { appRouter } from './trpc/appRouter';
import { CustomError } from './types';

export const app = express();

function initializeMiddlewares() {
  // Set the application to trust the reverse proxy
  app.set('trust proxy', true);

  app.use(
    morgan(env.LOG_FORMAT, {
      stream,
    })
  );
  console.log('origins', env.ALLOWED_ORIGINS);

  app.use(
    cors({
      origin: env.ALLOWED_ORIGINS,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Set-Cookie'],
    })
  );
  // app.use(cors({ origin: '*', credentials: true }));

  // secure the app by setting various HTTP headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    })
  );

  // compress response body to reduce the size of the response
  app.use(compression());

  // parse request body
  app.use('/express', express.json()); // do it only in "/express/*" path

  // app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: env.COMMON_RATE_LIMIT_WINDOW_MS ?? 1000 * 60, // 1 minute
    limit: env.COMMON_RATE_LIMIT_MAX_REQUESTS ?? 100, // each IP can make up to 100 requests per `windowsMs` (1 minute)
    standardHeaders: true, // add the `RateLimit-*` headers to the response
    legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
    keyGenerator: (req) => req.ip as string, // use ip as the key
    handler: (req, res) => {
      logger.warn(`Too many requests from ${req.ip} to ${req.path}`);
      res.status(429).send('Too many requests');
    },
  });

  app.use(limiter);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(express.static(path.join(__dirname, 'assets')));
}

function initializeStatusRoute() {
  // health check endpoint
  app.get('/status', (req, res) => {
    res.status(200).send('OK');
  });
}

function initializeTrpc() {
  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
      responseMeta: (opts) => {
        if (opts.errors.length) {
          const firstErrorCause = opts.errors[0]?.cause;

          if (firstErrorCause instanceof CustomError) {
            return {
              status: firstErrorCause.status,
            };
          }

          return {
            status: 500,
          };
        }

        return {
          status: 200,
        };
      },
    })
  );
}

function initializeTsRest() {
  // createExpressEndpoints(apiContract, tsRestRouter, app);
  // const openApiDocument = generateOpenApi(
  //   apiContract,
  //   {
  //     info: {
  //       title: 'Edusama API',
  //       version: '1.0.0',
  //     },
  //     components: {
  //       securitySchemes: {
  //         BasicAuth: {
  //           type: 'http',
  //           scheme: 'basic',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     operationMapper: (operation, appRoute) => {
  //       const hasCustomTags = (
  //         metadata: unknown,
  //       ): metadata is { openApiTags: string[] } => {
  //         return (
  //           !!metadata &&
  //           typeof metadata === 'object' &&
  //           'openApiTags' in metadata
  //         );
  //       };
  //       const hasSecurity = (
  //         metadata: unknown,
  //       ): metadata is { openApiSecurity: any[] } => {
  //         return (
  //           !!metadata &&
  //           typeof metadata === 'object' &&
  //           'openApiSecurity' in metadata
  //         );
  //       };
  //       return {
  //         ...operation,
  //         tags: hasCustomTags(appRoute.metadata)
  //           ? appRoute.metadata.openApiTags
  //           : [],
  //         security: hasSecurity(appRoute.metadata)
  //           ? appRoute.metadata.openApiSecurity
  //           : [],
  //       };
  //     },
  //   },
  // );
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
}

function initializeErrorMiddleware() {
  app.use(errorMiddleware);
}

function initializePingServerCronJob() {
  if (env.NODE_ENV === 'test' || env.NODE_ENV === 'development') {
    return;
  }

  // this is for keeping the backend alive in some cloud providers that have a timeout for the idle apps - Heroku, Render, etc.
  cron.schedule('0 */14 * * * *', () => {
    fetch(env.BACKEND_URL + '/status').catch(() => {
      logger.error('Backend is not available.');
    });
  });
}

function initializeCronJobs() {
  // every 3 hours
  cron.schedule('0 0 */3 * * *', () => {
    sendAttendanceNotifications();
  });
}

function setupGracefulShutdown(server: Server) {
  const onCloseSignal = () => {
    logger.info('sigint received, shutting down');
    server.close(() => {
      logger.info('server closed');
      process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGINT', onCloseSignal);
  process.on('SIGTERM', onCloseSignal);
}

function initialize() {
  try {
    initializeMiddlewares();
    initializeStatusRoute();
    initializeTrpc();
    initializeTsRest();
    initializePingServerCronJob();
    initializeCronJobs();
    initializeErrorMiddleware();
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
}

function start() {
  try {
    logger.info('Starting application...');
    initialize();

    const server = app.listen(env.PORT, () => {
      logger.info('=================================');
      logger.info(`======= ENV: ${env.NODE_ENV} =======`);
      logger.info(`🚀 App listening on the port ${env.PORT}`);
      logger.info('=================================');
    });

    setupGracefulShutdown(server);
    return server;
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

start();
