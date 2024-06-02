import { ALERT, REFETCH_CHATS } from '../constants/events';
import { asyncErrorHandler } from '../middlewares/error';
import { Chat } from '../models/chat';
import { User } from '../models/user';
import { type ChatType, type CustomRequestType, type UserType } from '../Types/types';
import { emitEvent } from '../utils/emitEvents';
import { errorMessage, successData } from '../utils/utility-func';

const newGroup = asyncErrorHandler(async (req: CustomRequestType<ChatType>, res, next) => {
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

const getMyChats = asyncErrorHandler(async (req: CustomRequestType<UserType>, res, next) => {
  // this is for showing users or groups in the sidebar for the requested user
  // const chats = await Chat.find({ members: req.user?._id }).populate('members', 'name avatar'); // here populate is used to get only name and avatar of the members of the chat

  // const transFormedChats = chats.map((chat) => {
  //   const otherMembers = getOtherMembers(
  //     chat.members,
  //     req?.user?._id || ''
  //   ) as PopulatedMembersType;
  //   return {
  //     _id: chat._id,
  //     name: chat.groupChat ? chat.name : otherMembers.name,
  //     avatar: chat.groupChat
  //       ? chat.members
  //           .slice(0, 3)
  //           .map(
  //             (member: PopulatedMembersType | string) =>
  //               typeof member !== 'string' && member.avatar.url
  //           )
  //       : [otherMembers.avatar.url],
  //     members: chat.members.reduce<string[]>(
  //       (prev: string[], curr: PopulatedMembersType | string) => {
  //         // prev means previous value that is returned from the previous iteration which is also called as accumulator and curr is the current value that is being processed in the current iteration
  //         if (typeof curr === 'string') {
  //           return prev;
  //         }
  //         if (curr._id.toString() !== req.user?._id.toString()) {
  //           prev.push(curr._id);
  //           return prev;
  //         }
  //         return prev;
  //       },
  //       []
  //     ),
  //   };
  // });

  const transFormedChats = await Chat.aggregate([
    {
      $match: {
        members: req?.user?._id,
      },
    },
    {
      $lookup: {
        // lookup method is similar to populate method in mongoose for getting data from other collections based on the reference
        from: 'users',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
      },
    },
    {
      // after lookup we get members as array of objects so we need to unwind it to get members as object
      $unwind: '$members',
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        groupChat: { $first: '$groupChat' },
        members: { $push: '$members' },
      },
    },
    {
      $project: {
        _id: 1,
        name: {
          $cond: {
            if: '$groupChat',
            then: '$name',
            else: { $arrayElemAt: ['$members.name', 0] },
          },
        },
        avatar: {
          $cond: {
            if: '$groupChat',
            then: {
              $slice: ['$members.avatar.url', 3],
            },
            else: [{ $arrayElemAt: ['$members.avatar.url', 0] }],
          },
        },
        members: {
          $map: {
            // map is used to iterate over the members array and get only the _id of the members except the current user
            input: {
              $filter: {
                // filter is used to filter the members array based on the condition provided
                input: '$members',
                as: 'member', // as is used to give the name to the current member that is being processed in the filter
                cond: {
                  $ne: ['$$member._id', req.user?._id],
                },
              },
            },
            as: 'member',
            in: '$$member._id', // in is used to get the value of the current member that is being processed in the map. Here $$ is used to get the value of the member coming from the filter and $$member._id is used from the as provided in the filter
          },
        },
      },
    },
  ]);

  return successData(res, '', transFormedChats);
});

const getMyGroups = asyncErrorHandler(async (req: CustomRequestType<UserType>, res, next) => {
  // const chats = await Chat.find({
  //   members: req?.user?._id,
  //   groupChat: true,
  //   creator: req.user?._id,
  // }).populate('members', 'name avatar');

  // const groups = chats.map((chat) => ({
  //   name: chat.name,
  //   groupChat: chat.groupChat,
  //   avatar: chat.members
  //     .slice(0, 3)
  //     .map(
  //       (member: PopulatedMembersType | string) => typeof member !== 'string' && member.avatar.url
  //     ),
  //   _id: chat._id,
  // }));

  const transFormedGroups = await Chat.aggregate([
    {
      $match: {
        members: req?.user?._id,
        groupChat: true,
        creator: req?.user?._id,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
      },
    },
    {
      $unwind: '$members',
    },
    {
      $group: {
        _id: '$_id',

        name: {
          $first: '$name',
        },
        groupChat: {
          $first: '$groupChat',
        },
        members: {
          $push: '$members',
        },
      },
    },
    {
      $project: {
        name: 1,
        groupChat: 1,
        avatar: {
          $slice: ['$members.avatar.url', 3],
        },
      },
    },
  ]);

  return successData(res, '', transFormedGroups);
});

const addMembers = asyncErrorHandler(
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

const removeMember = asyncErrorHandler(
  async (req: CustomRequestType<{ userId: string; chatId: string }>, res, next) => {
    const { userId, chatId } = req.body;

    const [chat, userThatwillBeRemoved] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, 'name'),
    ]);

    if (!chat) {
      errorMessage(next, 'Chat not found', 404);
      return;
    }

    if (!chat.groupChat) {
      errorMessage(next, 'This is not a group chat', 400);
      return;
    }

    if (chat.creator.toString() !== req.user._id.toString()) {
      errorMessage(next, 'You are not allowed to remove member from the group', 403);
      return;
    }

    if (chat.members.length <= 3) {
      errorMessage(next, 'Group chat must have at least 3 members', 400);
      return;
    }

    const allChatMembers = chat.members.map((mem) => mem.toString());

    // this method can also work for updating
    chat.members = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          members: userId,
        },
      },
      { new: true }
    );

    // or js filter method also work but it is not more efficient
    // chat.members = chat.members.filter((mem) => mem.toString() !== userId.toString());

    // await chat.save();

    emitEvent(
      req,
      ALERT,
      chat.members,
      `${userThatwillBeRemoved.name} has been removed from the group`
    );

    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully',
    });
  }
);

export { addMembers, getMyChats, getMyGroups, newGroup, removeMember };
