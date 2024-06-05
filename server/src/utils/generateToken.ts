import { type Response } from 'express';
import jwt from 'jsonwebtoken';

import chatConfig from '../config';
import { cookieOptions } from './cookieOptions';

const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, chatConfig.JWT_SECRET, {
    expiresIn: '15d',
  });

  res.cookie('token', token, cookieOptions);
  return token;
};
export { generateToken };
