import chatConfig from '../config';
import { type cookieOptionsType } from '../Types/types';

const cookieOptions: cookieOptionsType = {
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  secure: chatConfig.NODE_ENV !== 'DEVELOPMENT',
  sameSite: 'strict',
};

export { cookieOptions };
