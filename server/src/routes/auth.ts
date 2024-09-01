import express from 'express';

import {
  forgotPassword,
  loginUser,
  logOutUser,
  registerUser,
  resetPassword,
  updatePassword,
} from '../controllers/auth';
import { authenticateUser } from '../middlewares/authenticateUser';
import { singleAvatar } from '../middlewares/multer';
import { validateData } from '../middlewares/requestValidatorMiddleware';
import authSchema from '../validationSchema/auth';

const router = express.Router();

router.get('/logout', logOutUser);
router.post('/register', singleAvatar, registerUser);
router.post('/login', validateData(authSchema.Login), loginUser);
router.post('/forgot-password', validateData(authSchema.ForgotPassword), forgotPassword);
router.patch('/reset-password/:token', validateData(authSchema.ResetPassword), resetPassword);
router.patch(
  '/update-password',
  validateData(authSchema.UpdatePassword),
  authenticateUser,
  updatePassword
);

// Specify different HTTP methods for the same route
router
  .route('/:id')
  .get((req, res) => {
    // Handle GET request
    res.send(`GET request for ID: ${req.params.id}`);
  })
  .put((req, res) => {
    // Handle PUT request
    res.send(`PUT request for ID: ${req.params.id}`);
  });

export default router;
