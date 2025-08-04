import { logger } from '@api/libs/logger';
import { CustomError, LocalizedCustomErrorMessage } from '@api/types';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: LocalizedCustomErrorMessage | string = error.message;

    logger.error(
      `❌ [${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${JSON.stringify(message)}`
    );

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
