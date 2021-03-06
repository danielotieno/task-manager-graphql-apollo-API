import { gql } from 'apollo-server-express';

const userTypeDef = gql`
  extend type Query {
    user: User
  }

  extend type Mutation {
    createUser(input: createUserInput): User
    login(input: loginInput): Token
  }

  input loginInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
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
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Subscription {
    userCreated: User
  }
`;

export default userTypeDef;
