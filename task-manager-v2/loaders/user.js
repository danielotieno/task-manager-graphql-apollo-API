import User from '../database/models/user';

const batchUsers = async userIds => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return userIds.map(userId => users.find(user => user.id === userId));
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
};

export default batchUsers;
