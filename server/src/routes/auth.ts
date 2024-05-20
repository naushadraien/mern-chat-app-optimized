import express from 'express';

import { loginUser, logOutUser, registerUser } from '../controllers/auth';
import { singleAvatar } from '../middlewares/multer';
import { validateData } from '../middlewares/requestValidatorMiddleware';
import authSchema from '../validationSchema/auth';

const app = express.Router();

app.get('/logout', logOutUser);
app.post('/register', singleAvatar, validateData(authSchema.Register), registerUser);
app.post('/login', validateData(authSchema.Login), loginUser);

export default app;
