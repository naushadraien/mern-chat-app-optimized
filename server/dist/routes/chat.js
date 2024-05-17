import express from 'express';
import { authenticateUser } from '../utils/authenticateUser.js';
import { newGroup } from '../controllers/chat.js';
import { validateData } from '../middlewares/requestValidatorMiddleware.js';
import chatValidation from '../validationSchema/chat.js';
const app = express.Router();
app.use(authenticateUser);
app.post('/newGroup', validateData(chatValidation.NewGroup), newGroup);
export default app;
