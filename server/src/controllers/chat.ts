import { ALERT, REFETCH_CHATS } from '../constants/events';
import { TryCatch } from '../middlewares/error';
import { Chat } from '../models/chat';
import { User } from '../models/user';
import {
  type ChatType,
  type CustomRequestType,
  type PopulatedMembersType,
  type UserType,
} from '../Types/types';
import { emitEvent } from '../utils/emitEvents';
import { getOtherMembers } from '../utils/helperfunc';
import { errorMessage, successData } from '../utils/utility-func';

const newGroup = TryCatch(async (req: CustomRequestType<ChatType>, res, next) => {
  const { name, members } = req.body;

  if (members.includes(req?.user?._id.toString())) {
    errorMessage(
      next,
      'You are already included in members, please provide other two or more members',
      400
    );
    return;
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

const getMyChats = TryCatch(async (req: CustomRequestType<UserType>, res, next) => {
  // this is for showing users or groups in the sidebar for the requested user
  const chats = await Chat.find({ members: req.user?._id }).populate('members', 'name avatar'); // here populate is used to get only name and avatar of the members of the chat
  console.log('chats', chats);

  const transFormedChats = chats.map((chat) => {
    const otherMembers = getOtherMembers(
      chat.members,
      req?.user?._id || ''
    ) as PopulatedMembersType;
    return {
      _id: chat._id,
      name: chat.groupChat ? chat.name : otherMembers.name,
      avatar: chat.groupChat
        ? chat.members
            .slice(0, 3)
            .map(
              (member: PopulatedMembersType | string) =>
                typeof member !== 'string' && member.avatar.url
            )
        : [otherMembers.avatar.url],
      members: chat.members.reduce<string[]>(
        (prev: string[], curr: PopulatedMembersType | string) => {
          // prev means previous value that is returned from the previous iteration which is also called as accumulator and curr is the current value that is being processed in the current iteration
          if (typeof curr === 'string') {
            return prev;
          }
          if (curr._id.toString() !== req.user?._id.toString()) {
            prev.push(curr._id);
            return prev;
          }
          return prev;
        },
        []
      ),
    };
  });

  return successData(res, '', transFormedChats);
});

const getMyGroups = TryCatch(async (req: CustomRequestType<UserType>, res, next) => {
  const chats = await Chat.find({
    members: req?.user?._id,
    groupChat: true,
    creator: req.user?._id,
  }).populate('members', 'name avatar');

  const groups = chats.map((chat) => ({
    name: chat.name,
    groupChat: chat.groupChat,
    avatar: chat.members
      .slice(0, 3)
      .map(
        (member: PopulatedMembersType | string) => typeof member !== 'string' && member.avatar.url
      ),
    _id: chat._id,
  }));

  return successData(res, '', groups);
});

const addMembers = TryCatch(
  async (req: CustomRequestType<{ chatId: string; members: string[] }>, res, next) => {
    const { chatId, members } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      errorMessage(next, 'Chat not found', 404);
      return;
    }
    if (!chat.groupChat) {
      errorMessage(next, 'This is not a group chat', 400);
      return;
    }
    if (chat.creator.toString() !== req.user?._id.toString()) {
      errorMessage(next, 'You are not allowed to add members', 403);
      return;
    }

    const allNewMembersPromise = members.map((member) => User.findById(member).select('name'));

    const allNewMembers = await Promise.all(allNewMembersPromise);
    const uniqueNewMembers: string[] = allNewMembers
      .filter((mem) => !chat.members.includes(mem?._id ?? ''))
      .map((mem) => mem?._id ?? '');
    chat.members.push(...uniqueNewMembers);
    if (chat.members.length > 100) {
      errorMessage(next, 'Maximum members reached in this group', 400);
      return;
    }
    await chat.save();

    const allUserWithName = allNewMembers.map((mem) => mem?.name).join(',');

    emitEvent(req, ALERT, chat.members, `${allUserWithName} has been added in the group`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return successData(res, 'Members added successfully to the group', undefined);
  }
);

export { addMembers, getMyChats, getMyGroups, newGroup };
