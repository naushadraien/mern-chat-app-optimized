import type { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

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
}

export interface cookieOptionsType {
  httpOnly: boolean;
  maxAge: number;
  secure: boolean;
  sameSite: boolean | 'strict' | 'lax' | 'none' | undefined;
}
