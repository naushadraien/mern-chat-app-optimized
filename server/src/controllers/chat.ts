import { ALERT, REFETCH_CHATS } from '../constants/events.js';
import { TryCatch } from '../middlewares/error.js';
import { Chat } from '../models/Chat.js';
import { ChatType, CustomRequestType } from '../Types/types.js';
import { emitEvent } from '../utils/emitEvents.js';
import { errorMessage, successData } from '../utils/utility-func.js';

const newGroup = TryCatch(async (req: CustomRequestType<ChatType>, res, next) => {
  const { name, members } = req.body;

  if (members.includes(req?.user?.id)) {
    return errorMessage(
      next,
      'You are already included in members, please provide other two or more members',
      400
    );
  }
  const allMembers = [...members, req?.user?.id];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return successData(res, 'Group created successfully', undefined, true);
});

export { newGroup };
