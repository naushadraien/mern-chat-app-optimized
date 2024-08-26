import bcrypt from 'bcryptjs';
import mongoose, { type Model, Schema } from 'mongoose';
import validator from 'validator';

import { type UserType } from '../Types/types.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'], // it is validator in mongoose
      trim: true,
      minlength: [3, 'Name should be at least 3 characters'], // it is validator in mongoose
      maxlength: [20, 'Name should not exceed 20 characters'], // it is validator in mongoose
    },
    bio: {
      type: String,
      required: [true, 'Please provide biography'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'], // it is validator in mongoose
      unique: true, // it is not a validator so it is not written in []
      lowercase: true, // it is not a validator so it is not written in [] but it saves email in lowercase in database
      // match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please provide a valid email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [4, 'Password should be at least 4 characters'], // it is validator in mongoose
      select: false,
      //   maxlength: [20, "Password should not exceed 20 characters"],
    },
    avatar: {
      public_id: {
        type: String,
        required: [true, 'Please provide public_id'],
      },
      url: {
        type: String,
        required: [true, 'Please provide url'],
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    // if password is not modified then don't hash it like when we update the user's name or email but not the password itself then password is not modified so don't hash it
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// method to compare password in login
userSchema.methods.comparePassword = async function (
  receivedPassword: string,
  hashedInDBPassword: string
) {
  return await bcrypt.compare(receivedPassword, hashedInDBPassword);
};

userSchema.methods.isPasswordChanged = async function (jwtIssuedTime: number) {
  if (this.passwordChangedAt) {
    const passwordChangedTimeStamp = this.passwordChangedAt.getTime() / 1000; // divided by 1000 for time in seconds from millisecond
    return jwtIssuedTime < passwordChangedTimeStamp; // if password changed after the token was issued then return true eg. 1722790867 < 1722988800
  }
  return false;
};

export const User: Model<UserType> = mongoose.models.User || mongoose.model('User', userSchema);
