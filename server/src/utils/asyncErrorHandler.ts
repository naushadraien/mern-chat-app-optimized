import { type NextFunction, type Request, type Response } from 'express';

import { type ControllerType } from '../Types/types';

const asyncErrorHandler =
  (fn: ControllerType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default asyncErrorHandler;
