import jwt from 'jsonwebtoken';
import chatConfig from '../config/index.js';
import { TryCatch } from '../middlewares/error.js';
import { errorMessage } from './utility-func.js';
import { User } from '../models/User.js';
export const authenticateUser = TryCatch(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return errorMessage(next, 'Please login first', 400);
    }
    const decodedUser = jwt.verify(token, chatConfig.JWT_SECRET);
    const user = await User.findById(decodedUser.userId);
    req.user = user;
    next();
});
