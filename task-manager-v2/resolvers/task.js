import { v4 as uuidv4 } from 'uuid';
import { combineResolvers } from 'graphql-resolvers';

import Task from '../database/models/task';
import User from '../database/models/user';
import { isAuthenticated } from './middleware';

module.exports.taskResolver = {
  Query: {
    tasks: () => tasks,
    task: (_, { id }) => tasks.find(task => task.id === id),
  },

  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        try {
          const user = await User.findOne({ email });
          const task = new Task({ ...input, user: user.id });
          const result = await task.save();
          user.tasks.push(result.id);
          await user.save();
          return result;
        } catch (error) {
          console.log(error.message);
          throw error.message;
        }
      },
    ),
  },

  Task: {
    user: ({ userId }) => users.find(user => user.id === userId),
  },
};
