import { users, tasks } from '../data';

module.exports.userResolver = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
  },

  Mutation: {},

  User: {
    tasks: ({ id }) => tasks.filter(task => task.userId === id),
  },
};
