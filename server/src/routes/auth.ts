import express from 'express';

import { registerUser } from '../controllers/auth.js';
import { validateData } from '../middlewares/requestValidatorMiddleware.js';
import authSchema from '../validationSchema/auth.js';
import { singleAvatar } from '../middlewares/multer.js';

const app = express.Router();

app.post('/register', singleAvatar, validateData(authSchema.Register), registerUser);

export default app;
