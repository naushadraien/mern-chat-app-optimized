import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import chatConfig from '../config';
import { type ControllerType } from '../Types/types';
import type ErrorHandler from '../utils/utility-class';

interface ErrorResponse {
  success: boolean;
  status: string;
  name: string;
  message: string;
  stack?: string;
  schemaError?: string[] | string | undefined;
}

const JWT_ERROR = 'JsonWebTokenError';
const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
const MONGO_SERVER_ERROR = 'MongoServerError';
const SYNTAX_ERROR = 'SyntaxError';

const sendError = (error: ErrorHandler, req: Request, res: Response, _next: NextFunction) => {
  const NODE_ENV = process.env.NODE_ENV;

  const customError = {
    ...error,
    name: error.name,
    code: error.statusCode,
    message: error.message,
    stack: error.stack,
  };

  switch (customError.name) {
    case JWT_ERROR:
      customError.name = 'JWT Error';
      customError.message = 'Your token is invalid! Please log in again!!';
      customError.statusCode = StatusCodes.UNAUTHORIZED;
      break;
    case TOKEN_EXPIRED_ERROR:
      customError.name = 'JWT Token Expired';
      customError.message = 'Your token has expired! Please log in again!!';
      customError.statusCode = StatusCodes.UNAUTHORIZED;
      break;
    case MONGO_SERVER_ERROR:
      if (customError.code === 11000) {
        const duplicateField = customError.message
          .split('index: ')[1]
          .split('dup key')[0]
          .split('_')[0];
        customError.name = 'Duplicate field';
        customError.message = `Duplicate field ${duplicateField}. Please use another value`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
      }
      break;
    case SYNTAX_ERROR:
      if (customError.message.includes('Unexpected token ')) {
        customError.message = 'Invalid data format';
        customError.statusCode = StatusCodes.BAD_REQUEST;
      }
      break;
  }

  !customError.isOperational &&
    console.error(customError.message, {
      metadata: { ...customError, ip: req.ip, app: req.app.locals.title },
    });

  const errorResponse: ErrorResponse = {
    success: false,
    status: customError.status,
    name: customError.name,
    message: customError.message,
    schemaError: customError.details,
  };

  if (NODE_ENV === chatConfig.ENVS.DEV) {
    errorResponse.stack = customError.stack;
  }

  return res.status(error.statusCode || 500).json(errorResponse);
};

// this is errorHandler middleware function that is called when any error is thrown in the ErrorHandler class by using next(new ErrorHandler('User not found', 404))
const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.message ||= 'Internal server error';
  err.statusCode ||= 500;
  err.details ||= undefined;

  if (err.name === 'CastError') err.message = 'Invalid Id';

  sendError(err, req, res, next);
};

const asyncErrorHandler =
  (fn: ControllerType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export { asyncErrorHandler, errorMiddleware };
