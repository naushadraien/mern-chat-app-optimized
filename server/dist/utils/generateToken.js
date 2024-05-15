import jwt from 'jsonwebtoken';
import chatConfig from '../config/index.js';
import { cookieOptions } from './cookieOptions.js';
const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, chatConfig.JWT_SECRET, {
        expiresIn: '15d',
    });
    return res.cookie('token', token, cookieOptions);
};
export { generateToken };
