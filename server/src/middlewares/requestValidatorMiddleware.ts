import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

import { errorMessage } from '../utils/utility-func.js';

export function validateData<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      if (result.error instanceof ZodError) {
        // const errorMessages = result.error.errors.map((issue) => issue.message);

        const errorMessages = result.error.errors.map(
          (issue) => `${issue.path.join('')} ${':'} ${issue.message}`
        );
        //or
        // const errorMessages = result.error.errors.map((issue) => ({
        //   message: `${issue.path.join('.')} is ${issue.message}`,
        // }));

        // Create a new ErrorHandler with the error messages
        // const err = new ErrorHandler("Invalid data", 400, errorMessages);
        return errorMessage(next, 'Invalid Data', 400, errorMessages);
        // next(err);
      } else {
        // Create a new error with a generic message
        const error = new Error('An error occurred while validating the data');
        return next(error);
      }
    }

    next();
  };
}
