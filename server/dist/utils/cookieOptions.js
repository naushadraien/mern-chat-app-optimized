import chatConfig from '../config/index.js';
const cookieOptions = {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: chatConfig.NODE_ENV !== 'DEVELOPMENT',
    sameSite: 'strict',
};
export { cookieOptions };
