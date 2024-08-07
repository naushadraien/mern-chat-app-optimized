import { User } from '../models/user';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import { cookieOptions } from '../utils/cookieOptions';
import { generateToken } from '../utils/generateToken';
import { errorMessage, successData } from '../utils/utility-func';

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, bio, avatar, passwordChangedAt } = req.body;
  const alreadyExistedUser = await User.findOne({ email });

  if (alreadyExistedUser) {
    errorMessage(next, 'User with this email already exists', 400);
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    bio,
    avatar,
    passwordChangedAt,
  });

  generateToken(res, user._id);

  return successData(res, 'User registered successfully', user, true);
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password }: { email: string; password: string } = req.body;

  const existedUser = await User.findOne({ email }).select('+password');
  if (!existedUser) {
    errorMessage(next, 'Invalid email or password', 400);
    return;
  }

  const isPasswordMatch = await existedUser.comparePassword(password, existedUser.password);

  // const isPasswordMatch = await bcrypt.compare(password, existedUser.password);
  if (!isPasswordMatch) {
    errorMessage(next, 'Invalid email or password', 400);
    return;
  }
  const token = generateToken(res, existedUser._id);
  const data = {
    token,
    existedUser,
  };
  return successData(res, `Welcome back ${existedUser.name}`, data);
});

const logOutUser = asyncErrorHandler(async (req, res, next) => {
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

export { loginUser, logOutUser, registerUser };
