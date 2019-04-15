const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GRAPQL MODELS
const User = require("../../models/user");

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  signin: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist.");
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new Error("Password does not match!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "myveryawesomesecretkey",
      {
        expiresIn: "1hr"
      }
    );
    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    };
  }
};
