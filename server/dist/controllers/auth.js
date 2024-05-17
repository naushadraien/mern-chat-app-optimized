import bcrypt from 'bcryptjs';
import { TryCatch } from '../middlewares/error.js';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { errorMessage, successData } from '../utils/utility-func.js';
import { cookieOptions } from '../utils/cookieOptions.js';
const registerUser = TryCatch(async (req, res, next) => {
    const { name, email, password, bio, avatar } = req.body;
    const alreadyExistedUser = await User.findOne({ email });
    if (alreadyExistedUser) {
        return errorMessage(next, 'User with this email already exists', 400);
    }
    const user = await User.create({
        name,
        email,
        password,
        bio,
        avatar,
    });
    generateToken(res, user._id);
    return successData(res, 'User registerd successfully', user, true);
});
const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    const existedUser = await User.findOne({ email }).select('+password');
    if (!existedUser) {
        return errorMessage(next, 'Invalid email or password', 400);
    }
    const isPasswordMatch = await bcrypt.compare(password, existedUser.password);
    if (!isPasswordMatch) {
        return errorMessage(next, 'Invalid email or password', 400);
    }
    generateToken(res, existedUser._id);
    return successData(res, `Welcome back ${existedUser.name}`, existedUser);
});
const logOutUser = TryCatch(async (req, res, next) => {
    return res
        .status(200)
        .cookie('token', '', {
        ...cookieOptions,
        maxAge: 0,
    })
        .json({
        success: true,
        message: 'Logged out successfully',
    });
});
export { loginUser, registerUser, logOutUser };
