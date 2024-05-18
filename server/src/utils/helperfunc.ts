import { PopulatedMembersType } from '../Types/types.js';

const getOtherMembers = (members: PopulatedMembersType[] | string[], userId: string) => {
  return members.find(
    (member) => typeof member !== 'string' && member._id.toString() !== userId.toString()
  );
};

export { getOtherMembers };
