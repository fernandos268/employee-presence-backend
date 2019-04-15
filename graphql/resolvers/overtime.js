// GraphQL Models
const Overtime = require("../../models/overtime");
const User = require("../../models/user.js");

// Transform Response Data
const { transformOvertime } = require("./merge");

module.exports = {
  overtimes: async () => {
    try {
      const overtimes = await Overtime.find();

      return overtimes.map(overtime => {
        return transformOvertime(overtime);
      });
    } catch (error) {
      throw error;
    }
  },
  createOvertime: async (args, req) => {
    console.log(args.overtimeInput);
    if (!req.isAuth) {
      throw new Error("Not authenticated");
    }

    const overtime = new Overtime({
      date: new Date(args.overtimeInput.date),
      timeFrom: new Date(args.overtimeInput.timeFrom),
      timeTo: new Date(args.overtimeInput.timeTo),
      description: args.overtimeInput.description,
      creator: req.userId,
      status: args.overtimeInput.status
    });

    let createdOvertime;

    try {
      const result = await overtime.save();
      createdOvertime = transformOvertime(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User not found");
      }

      creator.createdOvertimes.push(overtime);
      await creator.save();

      return createdOvertime;
    } catch (error) {
      throw error;
    }
  },
  updateOvertime: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not authenticated");
    }

    try {
      const overtime = await Overtime.findById(args.updateOvertimeInput._id);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User not found");
      }

      overtime.status = args.updateOvertimeInput.status;

      await overtime.save();

      return transformOvertime(overtime);
    } catch (error) {
      throw error;
    }
  },
  deleteOvertime: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not authenticated");
    }

    try {
      const overtime = await Overtime.findById(args.overtimeId);
      await Overtime.deleteOne({ _id: args.overtimeId });
      return transformOvertime(overtime);
    } catch (error) {
      throw error;
    }
  }
};
