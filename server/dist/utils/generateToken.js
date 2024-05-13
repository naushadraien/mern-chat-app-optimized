import jwt from 'jsonwebtoken';
import chatConfig from '../config/index.js';
const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, chatConfig.JWT_SECRET, {
        expiresIn: '15d',
    });
    return res.cookie('token', token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        secure: chatConfig.NODE_ENV !== 'DEVELOPMENT',
        sameSite: 'strict',
    });
};
export { generateToken };
