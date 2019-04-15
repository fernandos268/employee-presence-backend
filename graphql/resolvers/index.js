const userResolver = require("./user");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");
const dayoffResolver = require("./dayoff");

const rootResolver = {
  ...userResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...dayoffResolver
};

module.exports = rootResolver;
