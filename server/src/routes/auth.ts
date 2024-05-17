import express from 'express';

import { loginUser, logOutUser, registerUser } from '../controllers/auth.js';
import { validateData } from '../middlewares/requestValidatorMiddleware.js';
import authSchema from '../validationSchema/auth.js';
import { singleAvatar } from '../middlewares/multer.js';

const app = express.Router();

app.get('/logout', logOutUser);
app.post('/register', singleAvatar, validateData(authSchema.Register), registerUser);
app.post('/login', validateData(authSchema.Login), loginUser);

export default app;
