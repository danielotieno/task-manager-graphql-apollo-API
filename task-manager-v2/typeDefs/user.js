import { gql } from 'apollo-server-express';

const userTypeDef = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }
`;

export default userTypeDef;
