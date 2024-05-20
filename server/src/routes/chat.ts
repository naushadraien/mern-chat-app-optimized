import express from 'express';

import { addMembers, getMyChats, getMyGroups, newGroup } from '../controllers/chat';
import { authenticateUser } from '../middlewares/authenticateUser';
import { validateData } from '../middlewares/requestValidatorMiddleware';
import { chatValidation } from '../validationSchema';

const app = express.Router();

app.use(authenticateUser);

app.get('/myChats', getMyChats);
app.get('/myGroups', getMyGroups);
app.post('/newGroup', validateData(chatValidation.NewGroup), newGroup);
app.put('/addMembers', validateData(chatValidation.AddMembers), addMembers);

export default app;
