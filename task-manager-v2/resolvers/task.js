import { v4 as uuidv4 } from 'uuid';
import { combineResolvers } from 'graphql-resolvers';

import Task from '../database/models/task';
import User from '../database/models/user';
import { isAuthenticated, isTaskOwner } from './middleware';

module.exports.taskResolver = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_, __, { loggedInUser }) => {
        try {
          const tasks = await Task.find({ user: loggedInUser });
          return tasks;
        } catch (error) {
          console.log(error.message);
          throw error.message;
        }
      },
    ),
    task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
      try {
        const task = await Task.findById(id);
        return task;
      } catch (error) {
        console.log(error.message);
        throw error.message;
      }
    }),
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
    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id, input }) => {
        try {
          const task = await Task.findByIdAndUpdate(
            id,
            { ...input },
            { new: true },
          );
          return task;
        } catch (error) {
          console.log(error.message);
          throw error.message;
        }
      },
    ),
  },

  Task: {
    user: async parent => {
      try {
        const user = await User.findById(parent.user);
        return user;
      } catch (error) {
        console.log(error.message);
        throw error.message;
      }
    },
  },
};
