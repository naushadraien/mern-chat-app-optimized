import express from 'express';

import { addMembers, getMyChats, getMyGroups, newGroup, removeMember } from '../controllers/chat';
import { authenticateUser } from '../middlewares/authenticateUser';
import { validateData } from '../middlewares/requestValidatorMiddleware';
import { chatValidation } from '../validationSchema';

const router = express.Router();

router.use(authenticateUser);

router.get('/myChats', getMyChats);
router.get('/myGroups', getMyGroups);
router.post('/newGroup', validateData(chatValidation.NewGroup), newGroup);
router.put('/addMembers', validateData(chatValidation.AddMembers), addMembers);
router.put('/removeMember', validateData(chatValidation.RemoveMember), removeMember);

export default router;
