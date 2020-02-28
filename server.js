import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import dotEnv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import { tasks, users } from './data';

// env config
dotEnv.config();

const app = express();

// setup cors

app.use(cors());

// body parser middleware
app.use(express.json({ extended: false }));

const typeDefs = gql`
  type Query {
    tasks: [Task!]
    task(id: ID!): Task
    users: [User!]
    user(id: ID!): User
  }

  input createTaskInput {
    name: String!
    completed: Boolean!
    userId: ID!
  }

  type Mutation {
    createTask(input: createTaskInput!): Task
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }
`;

const resolvers = {
  Query: {
    tasks: () => tasks,
    task: (_, { id }) => tasks.find(task => task.id === id),
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
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

  User: {
    tasks: ({ id }) => tasks.filter(task => task.userId === id),
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
  res.send({ message: 'Hello' });
});

app.listen(PORT, () => {
  console.log(`Server listening at Port: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});
