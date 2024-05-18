const getOtherMembers = (members, userId) => {
    return members.find((member) => typeof member !== 'string' && member._id.toString() !== userId.toString());
};
export { getOtherMembers };
