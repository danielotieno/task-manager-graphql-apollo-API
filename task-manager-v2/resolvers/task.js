import { v4 as uuidv4 } from 'uuid';

import { users, tasks } from '../data';

module.exports.taskResolver = {
  Query: {
    tasks: () => tasks,
    task: (_, { id }) => tasks.find(task => task.id === id),
  },

  Mutation: {
    createTask: (_, { input }) => {
      const task = { ...input, id: uuidv4() };
      tasks.push(task);
      return task;
    },
  },

  Task: {
    user: ({ userId }) => users.find(user => user.id === userId),
  },
};
