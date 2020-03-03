import { GraphQLDateTime } from 'graphql-iso-date';

import { userResolver } from './user';
import { taskResolver } from './task';

const customDateScalarResolver = {
  Date: GraphQLDateTime,
};

module.exports = [userResolver, taskResolver, customDateScalarResolver];
