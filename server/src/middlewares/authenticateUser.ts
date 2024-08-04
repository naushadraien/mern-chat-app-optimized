import jwt, { type JwtPayload } from 'jsonwebtoken';

import chatConfig from '../config';
import { User } from '../models/user';
import { type CustomRequestType, type UserType } from '../Types/types';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import { errorMessage } from '../utils/utility-func';

export const authenticateUser = asyncErrorHandler(
  async (req: CustomRequestType<UserType>, res, next) => {
    // const tokenFromReqHeader = req.headers.authorization.split(' ')[1];
    // if (!tokenFromReqHeader) {
    //   errorMessage(next, 'Please login first', 400);
    //   return;
    // }
    // const decodedUserFromToken = jwt.verify(
    //   tokenFromReqHeader,
    //   chatConfig.JWT_SECRET
    // ) as JwtPayload;
    // console.log('decoded User', decodedUserFromToken);

    const token = req.cookies.token as string;

    if (!token) {
      errorMessage(next, 'Please login first', 400);
      return;
    }
    const decodedUser = jwt.verify(token, chatConfig.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decodedUser.userId);

    req.user = user as UserType;
    next();
  }
);
