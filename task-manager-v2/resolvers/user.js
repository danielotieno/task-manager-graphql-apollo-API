import bcrypt from 'bcryptjs';

import { users, tasks } from '../data';
import User from '../database/models/user';

module.exports.userResolver = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
  },

  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(input.password, 12);
        const newUser = new User({ ...input, password: hashedPassword });
        const result = await newUser.save();
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },

  User: {
    tasks: ({ id }) => tasks.filter(task => task.userId === id),
  },
};
