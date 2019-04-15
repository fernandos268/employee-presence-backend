require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

// GraphQL Schema & Resolvers
const GraphQlSchema = require("./graphql/schema");
const GraphQlResolvers = require("./graphql/resolvers");

// Custom Middlewares
const isAuth = require("./middleware/is-auth");

const app = express();
const PORT = 4040;

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: GraphQlSchema,
    rootValue: GraphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@ds239206.mlab.com:39206/${process.env.MONGO_DB}`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening to http://localhost:${PORT}/graphql`);
    });
  })
  .catch(err => {
    console.log(err);
  });
