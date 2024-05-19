import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { addMembers, getMyChats, getMyGroups, newGroup } from '../controllers/chat.js';
import { validateData } from '../middlewares/requestValidatorMiddleware.js';
import chatValidation from '../validationSchema/chat.js';

const app = express.Router();

app.use(authenticateUser);

app.get('/myChats', getMyChats);
app.get('/myGroups', getMyGroups);
app.post('/newGroup', validateData(chatValidation.NewGroup), newGroup);
app.put('/addMembers', validateData(chatValidation.AddMembers), addMembers);

export default app;
