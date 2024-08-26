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

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    errorMessage(next, 'User with the provided email not found', 404);
    return;
  }

  const resetToken = await user.generatePasswordResetToken();
  // if we not use save in the generatePasswordResetToken instance method in the user schema then we use the save method here to save the token in the db
  // await user.save({ validateBeforeSave: false });

  console.log('resetToken', resetToken);

  // generate a random reset token
  // send the token back to the user email
});
const resetPassword = asyncErrorHandler(async (req, res, next) => {
  console.log('i am from forgot password controller');
});

export { forgotPassword, loginUser, logOutUser, registerUser, resetPassword };
