import { gql } from 'apollo-server-express';

import userTypeDef from './user';
import taskTypeDef from './task';

const typeDefs = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

module.exports = [typeDefs, userTypeDef, taskTypeDef];
