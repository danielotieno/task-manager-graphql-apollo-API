import { skip } from 'graphql-resolvers';

import Task from '../../database/models/task';
import { isValidObjectId } from '../../database/util';

const isAunthenticated = (_, __, { email }) => {
  if (!email) {
    throw new Error('Access Denied!! Please login to continue');
  }
  return skip;
};

const isTaskOwner = async (_, { id }, { loggedInUser }) => {
  try {
    if (!isValidObjectId()) {
      throw new Error('Invalid Task Id');
    }
    const task = await Task.findById({ id });
    if (!task) {
      throw new Error('Task not found');
    } else if (task.user.toString !== loggedInUser) {
      throw new Error('Access Denied');
    }
    return skip;
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
};

export default {
  isAunthenticated,
  isTaskOwner,
};
