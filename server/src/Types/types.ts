import type { NextFunction, Request, Response } from 'express';
import { type Document } from 'mongoose';

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any | Response<any, Record<string, any>>>;

export interface UserType extends Document {
  _id: string;
  name: string;
  bio: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  passwordChangedAt: Date;
  role?: string;
  createdAt: string;
  updatedAt: string;
  comparePassword?: (receivedPassword: string, hashedInDBPassword: string) => Promise<boolean>;
  isPasswordChanged?: (jwtIssuedTime: number) => Promise<boolean>;
}

export interface cookieOptionsType {
  httpOnly: boolean;
  maxAge: number;
  secure: boolean;
  sameSite: boolean | 'strict' | 'lax' | 'none' | undefined;
}

export interface CustomRequestType<T> extends Request {
  user?: UserType;
  body: T;
}

// export interface ErrorDetailsType {
//   message?: string;
// }

// const testMap: { [key: number]: string } = {
//   1: 'Ok',
// };

// export interface ChatType extends Document {
//   name: string;
//   groupChat: boolean;
//   creator: string;
//   members: string[];
//   createdAt: string;
//   updatedAt: string;
// }

export interface IChatType {
  name: string;
  groupChat: boolean;
  creator: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatType extends Document, IChatType {}
export interface PopulatedMembersType {
  _id: string;
  name: string;
  avatar: {
    public_id: string;
    url: string;
  };
}
