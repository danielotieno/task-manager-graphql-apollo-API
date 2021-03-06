import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import dotEnv from 'dotenv';
import Dataloader from 'dataloader';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

import connection from './database/util';
import { verifyUser } from './helper/context';
import loaders from './loaders';

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
  context: async ({ req, connection }) => {
    const contextObj = {};

    if(req){
    await verifyUser(req);
    contextObj.email = req.email,
    contextObj.loggedInUser = req.loggedInUser,
    }
    contextObj.loaders = {
        user: new Dataloader(keys => loaders.batchUsers(keys)),
      }
      return contextObj
  }
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;

app.use('/', (req, res, next) => {
  res.send({ message: 'Hello' });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening at Port: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer)
