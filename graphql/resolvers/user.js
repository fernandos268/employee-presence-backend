const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GRAPQL MODELS
const User = require("../../models/user");

// Transform Response Data
const { transformUser, user } = require("./merge");

module.exports = {
  users: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Not authenticated");
    // }
    try {
      const users = await User.find();

      return users.map(user => {
        return transformUser(user);
      });
    } catch (error) {
      throw error;
    }
  },
  fetchUser: async ({ userId }, req) => {
    if (!req.isAuth) {
      // throw new Error("Not authenticated");
      return {
        ok: false,
        errors: [{ path: "authentication", message: "Not authenticated" }]
      };
    }
    try {
      const fetchedUser = user(userId);

      return { ok: true, user: fetchedUser };
    } catch (error) {
      // throw error;
      return {
        ok: false,
        errors: [{ path: error.path, message: error.message }]
      };
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        // throw new Error({ path: "email", message: "Email is already used." });
        return {
          email: null,
          ok: false,
          errors: [{ path: "email", message: "Email is already used" }]
        };
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        suffix: args.userInput.suffix,
        username: args.userInput.username,
        email: args.userInput.email,
        password: hashedPassword,
        isAdmin: args.userInput.isAdmin
      });

      const result = await user.save();
      // const createdUser = { ...result._doc, password: null, _id: result.id };
      // return { ...result._doc, password: null, _id: result.id };
      return { user: result, errors: [], ok: true };
    } catch (err) {
      return {
        email: null,
        ok: false,
        errors: [{ path: err.path, message: err.message }]
      };

      // throw err;
    }
  },
  signin: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      // throw new Error("User does not exist");

      // return {
      //   email: null,
      //   ok: false,
      //   errors: [
      //     {
      //       path: "signinCredentials",
      //       message: "Email or Password is incorrect"
      //     }
      //   ]
      // };
      // FOR DEV TESTING
      return {
        ok: false,
        errors: [
          {
            path: "signinCredentials",
            message: "User does not exist!"
          }
        ]
      };
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // throw new Error("Password is incorrect!");

      // return {
      //   email: null,
      //   ok: false,
      //   errors: [
      //     {
      //       path: "signinCredentials",
      //       message: "Email or Password is incorrect"
      //     }
      //   ]
      // };

      // FOR DEV TESTING
      return {
        ok: false,
        errors: [
          {
            path: "signinCredentials",
            message: "Password is incorrect!"
          }
        ]
      };
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      "myveryawesomesecretkey",
      {
        expiresIn: "1h"
      }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
      ok: true,
      errors: []
    };
  }
};
