import crypto from 'crypto';
import { type Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../models/user';
import { type CustomRequestType, type UserType } from '../Types/types';
import asyncErrorHandler from '../utils/asyncErrorHandler';
import { cookieOptions } from '../utils/cookieOptions';
import { generateToken } from '../utils/generateToken';
import { sendTemplateEmail } from '../utils/sendEmail';
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

  // generate a random reset token
  const resetToken = await user.generatePasswordResetToken();
  // if we not use save in the generatePasswordResetToken instance method in the user schema then we use the save method here to save the token in the db
  // await user.save({ validateBeforeSave: false });

  // Construct the reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
  // const resetURL = `${req.protocol}://${req.get('host')}/resetPassword?email=${user.email}&token=${resetToken}`;

  // send the token back to the user email
  try {
    await sendTemplateEmail('bar@example.com', 'Password Reset', 'passwordReset', {
      name: `Hello ${user.name}`,
      resetLink: resetURL,
    });
    successData(res, 'Password reset link send to the user email', undefined);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    errorMessage(next, 'Failed to send email. Please try again later', 500);
  }
});

// Request extending types
// Request Parameters: The first generic parameter.
// Response Body: The second generic parameter.
// Request Body: The third generic parameter.
// Request Query: The fourth generic parameter.

// Define types for request parameters, query, and body
// interface ResetPasswordParams {
//   token: string;
// }

// interface ResetPasswordQuery {
//   search: string;
// }

// interface ResetPasswordBody {
//   newPassword: string;
// }

const resetPassword = asyncErrorHandler(
  async (
    req: Request<{ token: string }, undefined, { password: string }, undefined>,
    // req: Request<ResetPasswordParams, {}, ResetPasswordBody, ResetPasswordQuery>,
    res,
    next
  ) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // const existedUser = await User.findOne({ email }, '+password');
    const existedUser = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: new Date(),
      },
    });

    if (!existedUser) {
      errorMessage(next, 'Token is invalid or has expired', 400);
      return;
    }

    existedUser.password = req.body.password;
    existedUser.passwordResetToken = undefined;
    existedUser.passwordResetExpires = undefined;
    existedUser.passwordChangedAt = new Date();

    await existedUser.save();
    const loginToken = generateToken(res, existedUser._id);
    successData(
      res,
      'Your password has been successfully reset. You can now log in with your new password.',
      { token: loginToken }
    );
  }
);

const updatePassword = asyncErrorHandler(
  async (req: CustomRequestType<{ currentPassword: string; newPassword: string }>, res, next) => {
    const existingUser = await User.findById(req.user._id).select('+password');
    if (!existingUser) {
      errorMessage(next, 'User not found', StatusCodes.NOT_FOUND);
      return;
    }

    const isCorrectPassword = await existingUser.comparePassword(
      req.body.currentPassword,
      existingUser.password
    );

    if (!isCorrectPassword) {
      errorMessage(next, 'Password you provided is wrong', StatusCodes.BAD_REQUEST);
      return;
    }

    existingUser.password = req.body.newPassword;
    existingUser.passwordChangedAt = new Date();
    await existingUser.save();

    const token = generateToken(res, existingUser._id);

    successData(res, 'Password changed successfully', {
      token,
    });
  }
);

export { forgotPassword, loginUser, logOutUser, registerUser, resetPassword, updatePassword };
