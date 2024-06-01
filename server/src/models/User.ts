import bcrypt from 'bcryptjs';
import mongoose, { type Model, Schema } from 'mongoose';

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
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [4, 'Password should be at least 8 characters'],
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
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

export const User: Model<UserType> = mongoose.models.User || mongoose.model('User', userSchema);
