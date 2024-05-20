import type { NextFunction, Request, Response } from 'express';

import { type ControllerType } from '../Types/types';
import type ErrorHandler from '../utils/utility-class';

const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.message ||= 'Internal server error';
  err.statusCode ||= 500;
  err.details ||= undefined;

  if (err.name === 'CastError') err.message = 'Invalid Id';

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    details: err.details,
  });
};

const TryCatch =
  (fn: ControllerType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export { errorMiddleware, TryCatch };
