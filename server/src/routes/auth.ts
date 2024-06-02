import express from 'express';

import { loginUser, logOutUser, registerUser } from '../controllers/auth';
import { singleAvatar } from '../middlewares/multer';
import { validateData } from '../middlewares/requestValidatorMiddleware';
import authSchema from '../validationSchema/auth';

const router = express.Router();

router.get('/logout', logOutUser);
router.post('/register', singleAvatar, validateData(authSchema.Register), registerUser);
router.post('/login', validateData(authSchema.Login), loginUser);

export default router;
