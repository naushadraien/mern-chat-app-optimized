import jwt, { type JwtPayload } from 'jsonwebtoken';

import chatConfig from '../config';
import { User } from '../models/User';
import { type CustomRequestType, type UserType } from '../Types/types';
import { errorMessage } from '../utils/utility-func';
import { TryCatch } from './error';

export const authenticateUser = TryCatch(async (req: CustomRequestType<UserType>, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    errorMessage(next, 'Please login first', 400);
    return;
  }
  const decodedUser = jwt.verify(token, chatConfig.JWT_SECRET) as JwtPayload;
  const user = await User.findById(decodedUser.userId);

  req.user = user as UserType;
  next();
});
