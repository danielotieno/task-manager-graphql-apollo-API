import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import dotEnv from 'dotenv';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

import connection from './database/util';
import verifyUser from './helper/context';

// env config
dotEnv.config();

const app = express();

// Database connection
connection();

// setup cors

app.use(cors());

// body parser middleware
app.use(express.json({ extended: false }));

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    await verifyUser(req);
    return {
      email: req.email,
    };
  },
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;

app.use('/', (req, res, next) => {
  res.send({ message: 'Hello' });
});

app.listen(PORT, () => {
  console.log(`Server listening at Port: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});
