import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';

import Task from '../database/models/task';
import User from '../database/models/user';
import isAuthenticated from './middleware';
import PubSub from '../subscription';
import { userEvents } from '../subscription/events';

module.exports.userResolver = {
  Query: {
    user: combineResolvers(isAuthenticated, async (_, _, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('User not faound');
        }
        return user;
      } catch (error) {
        console.log(error.message);
        throw error.message;
      }
    }),
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
        PubSub.publish(userEvents.USER_CREATED, { userEvents: result });
        return result;
      } catch (error) {
        console.log(error.message);
        throw error.message;
      }
    },

    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error('Wrong Credentials');
        }
        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error('Wrong Credentials');
        }
        const secret = process.env.JWT_SECRETE || 'myscretekey';
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: '1d',
        });
        return { token };
      } catch (error) {
        console.log(error.message);
        throw error.message;
      }
    },
  },

  Subscription: {
    userCreated: {
      subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED),
    },
  },

  User: {
    tasks: async ({ id }) => {
      try {
        const tasks = await Task.find({ user: id });
        return tasks;
      } catch (error) {
        console.log(error.message);
        throw error.message;
      }
    },
  },
};
