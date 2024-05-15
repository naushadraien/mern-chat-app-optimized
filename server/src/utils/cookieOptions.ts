import chatConfig from '../config/index.js';
import { cookieOptionsType } from '../Types/types.js';

const cookieOptions: cookieOptionsType = {
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  secure: chatConfig.NODE_ENV !== 'DEVELOPMENT',
  sameSite: 'strict',
};

export { cookieOptions };
