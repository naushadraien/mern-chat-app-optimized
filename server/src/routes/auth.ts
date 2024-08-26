import express from 'express';

import {
  forgotPassword,
  loginUser,
  logOutUser,
  registerUser,
  resetPassword,
} from '../controllers/auth';
import { singleAvatar } from '../middlewares/multer';
import { validateData } from '../middlewares/requestValidatorMiddleware';
import authSchema from '../validationSchema/auth';

const router = express.Router();

router.get('/logout', logOutUser);
router.post('/register', singleAvatar, registerUser);
router.post('/login', validateData(authSchema.Login), loginUser);
router.post('/forgot-password', validateData(authSchema.ForgotPassword), forgotPassword);
router.post('/reset-password', validateData(authSchema.ForgotPassword), resetPassword);

export default router;
