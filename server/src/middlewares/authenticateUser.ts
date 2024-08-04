import jwt, { type JwtPayload } from 'jsonwebtoken';

import chatConfig from '../config';
import { User } from '../models/user';
import { type CustomRequestType, type UserType } from '../Types/types';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import { errorMessage } from '../utils/utility-func';

export const authenticateUser = asyncErrorHandler(
  async (req: CustomRequestType<UserType>, res, next) => {
    // const testToken = req.headers.authorization;
    // let tokenFromReqHeader;
    // if (testToken && testToken.startsWith('Bearer')) {
    //   // tokenFromReqHeader = req.headers.authorization.split(' ')[1];
    // }
    // if (!tokenFromReqHeader) {
    //   errorMessage(next, 'Please login first', 400);
    //   return;
    // }
    // const decodedToken = jwt.verify(
    //   tokenFromReqHeader,
    //   chatConfig.JWT_SECRET
    // ) as JwtPayload;
    // console.log('decoded User', decodedToken);

    const token = req.cookies.token as string;

    if (!token) {
      errorMessage(next, 'Please login first', 400);
      return;
    }
    const decodedToken = jwt.verify(token, chatConfig.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      errorMessage(next, 'User with given token does not exist.', 401);
      return;
    }

    // if the user changed the password after the token was issued then the token should be invalid
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    if (isPasswordChanged) {
      errorMessage(next, 'User recently changed password. Please login again.', 401);
      return;
    }

    req.user = user as UserType;
    next();
  }
);
