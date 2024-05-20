import { type PopulatedMembersType } from '../Types/types';

const getOtherMembers = (members: PopulatedMembersType[] | string[], userId: string) => {
  return members.find(
    (member) => typeof member !== 'string' && member._id.toString() !== userId.toString()
  );
};

export { getOtherMembers };
