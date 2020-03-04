import { skip } from 'graphql-resolvers';

const isAunthenticated = (_, _, { email }) => {
  if (!email) {
    throw new Error('Access Denied!! Please login to continue');
  }
  return skip;
};

export default isAunthenticated;
