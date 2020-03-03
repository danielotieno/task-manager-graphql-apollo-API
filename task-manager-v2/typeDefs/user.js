import { gql } from 'apollo-server-express';

const userTypeDef = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(input: createUserInput): User
  }

  input createUserInput {
    name: String!
    email: String!
    password: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
    createdAt: String!
    updatedAt: String!
  }
`;

export default userTypeDef;
