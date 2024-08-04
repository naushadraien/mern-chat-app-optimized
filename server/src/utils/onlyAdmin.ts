import { type NextFunction, type Response } from 'express';

import { type CustomRequestType, type UserType } from '../Types/types';
import { errorMessage } from './utility-func';

export const onlyAdmin = (role: string[]) => {
  return (req: CustomRequestType<UserType>, res: Response, next: NextFunction) => {
    if (!role.includes(req?.user?.role)) {
      errorMessage(next, 'You have no permission to access this route', 403);
    }
    next();
  };
};
