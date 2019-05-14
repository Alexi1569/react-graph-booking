const userResolver = require('../resolvers/user');
const eventResolver = require('../resolvers/event');
const bookingResolver = require('../resolvers/booking');

const rootResolver = {
  ...userResolver,
  ...eventResolver,
  ...bookingResolver
};

module.exports = rootResolver;
