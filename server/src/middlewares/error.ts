import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import chatConfig from '../config';
import ENVS from '../constants/deploymentStatus';
import {
  AUTHENTICATION_ERROR,
  CAST_ERROR,
  JWT_ERROR,
  MONGO_SERVER_ERROR,
  NOT_FOUND_ERROR,
  RATE_LIMIT_ERROR,
  SYNTAX_ERROR,
  TOKEN_EXPIRED_ERROR,
  VALIDATION_ERROR,
} from '../constants/errorName';
import { type ErrorResponse } from '../Types/error';
import type ErrorHandler from '../utils/utility-class';

const sendError = (error: ErrorHandler, req: Request, res: Response, _next: NextFunction) => {
  const customError = {
    ...error,
    name: error.name,
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    mongoCode: error.code,
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
      if (customError.mongoCode === 11000) {
        const duplicateField = customError.message
          .split('index: ')[1]
          .split('dup key')[0]
          .split(' ')[0]
          .slice(0, -1); // Remove the trailing underscore

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
    case CAST_ERROR:
      customError.name = 'Invalid ID';
      customError.message = 'The provided ID is not valid.';
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    case VALIDATION_ERROR:
      customError.name = 'Validation Error';
      // customError.message = 'Invalid data provided.';
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    case NOT_FOUND_ERROR:
      customError.name = 'Not Found';
      customError.message = 'The requested resource could not be found.';
      customError.statusCode = StatusCodes.NOT_FOUND;
      break;
    case AUTHENTICATION_ERROR:
      customError.name = 'Authentication Error';
      customError.message = 'You are not authorized to access this resource.';
      customError.statusCode = StatusCodes.FORBIDDEN;
      break;
    case RATE_LIMIT_ERROR:
      customError.name = 'Rate Limit Exceeded';
      customError.message = 'Too many requests. Please try again later.';
      customError.statusCode = StatusCodes.TOO_MANY_REQUESTS;
      break;
  }

  !customError.isOperational &&
    console.error(customError.message, {
      metadata: {
        ...customError,
        ip: req.ip,
        app: req.app.locals.title,
        method: req.method,
        url: req.originalUrl,
        // timestamp: new Date().toISOString(),
        timestamp: new Date().toLocaleString(),
        environment: chatConfig.NODE_ENV,
      },
    });

  const errorResponse: ErrorResponse = {
    success: false,
    status: customError.status,
    name: customError.name,
    message: customError.message,
    schemaError: customError.details,
  };

  if (chatConfig.NODE_ENV === ENVS.DEV) {
    errorResponse.stack = customError.stack;
  }

  return res.status(customError.statusCode || 500).json(errorResponse);
};

// this is errorHandler middleware function that is called when any error is thrown in the ErrorHandler class by using next(new ErrorHandler('User not found', 404))
const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  sendError(err, req, res, next);
};

export { errorMiddleware };
