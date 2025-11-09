import { initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { logger } from '../libs/logger';
import { authMiddleware } from '../middlewares/trpc';
import { CustomError } from '../types';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return { req, res };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    if (opts.error.cause instanceof CustomError) {
      logger.error(
        `❌ [${opts.ctx?.req.method}] ${opts.ctx?.req.path} >> StatusCode:: ${opts.error.cause.status}, Message:: ${JSON.stringify(opts.error.cause.message)}`
      );
      return {
        ...shape,
        data: {
          message: opts.error.cause.message,
        },
      };
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
// export const protectedProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);

export type MiddlewareFunction = Parameters<typeof t.procedure.use>[0];

// export type BaseMiddlewareFunction<$ContextIn> = MiddlewareFunctionGeneric<
//   { _ctx_out: $ContextIn } & ProcedureParams,
//   ProcedureParams
// >;
