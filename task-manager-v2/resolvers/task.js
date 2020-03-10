import { combineResolvers } from 'graphql-resolvers';

import Task from '../database/models/task';
import User from '../database/models/user';
import { isAuthenticated, isTaskOwner } from './middleware';
import { stringToBase64, base64ToString } from '../helper';

module.exports.taskResolver = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_, { cursor, limit = 5 }, { loggedInUser }) => {
        try {
          const query = { user: loggedInUser };
          if (cursor) {
            query['_id'] = {
              $lt: base64ToString(cursor),
            };
          }
          let tasks = await Task.find(query)
            .sort({ _id: -1 })
            .limit(limit + 1);
          const hasNextPage = tasks.length > limit;
          tasks = hasNextPage ? tasks.slice(0, -1) : tasks;
          return {
            taskFeed: tasks,
            pageInfo: {
              nextPageCursor: hasNextPage
                ? stringToBase64(tasks[tasks.length - 1])
                : null,
              hasNextPage,
            },
          };
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

    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id }, { loggedInUser }) => {
        try {
          const task = await Task.findByIdAndDelete(id);
          await User.updateOne(
            { _id: loggedInUser },
            { $pull: { tasks: task.id } },
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
    user: async (parent, _, { loaders }) => {
      try {
        // const user = await User.findById(parent.user);
        const user = await loaders.user.load(parent.user.toString());
        return user;
      } catch (error) {
        console.log(error.message);
        throw error.message;
      }
    },
  },
};
