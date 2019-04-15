const userResolver = require("./user");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");
const dayoffResolver = require("./dayoff");
const overtimeResolver = require("./overtime");

const rootResolver = {
  ...userResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...dayoffResolver,
  ...overtimeResolver
};

module.exports = rootResolver;
