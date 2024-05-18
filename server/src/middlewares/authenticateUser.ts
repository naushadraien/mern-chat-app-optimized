import jwt, { JwtPayload } from 'jsonwebtoken';
import chatConfig from '../config/index.js';
import { TryCatch } from './error.js';
import { errorMessage } from '../utils/utility-func.js';
import { CustomRequestType, UserType } from '../Types/types.js';
import { User } from '../models/User.js';

export const authenticateUser = TryCatch(async (req: CustomRequestType<UserType>, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return errorMessage(next, 'Please login first', 400);
  }
  const decodedUser = jwt.verify(token, chatConfig.JWT_SECRET) as JwtPayload;
  const user = await User.findById(decodedUser.userId);

  req.user = user as UserType;
  next();
});
