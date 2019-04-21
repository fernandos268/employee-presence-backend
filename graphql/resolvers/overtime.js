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
    if (!req.isAuth) {
      // throw new Error("Not authenticated");
      return {
        ok: false,
        errors: [{ path: "authentication", message: "Not authenticated" }]
      }
    }

    const overtime = new Overtime({
      date: new Date(args.overtimeInput.date),
      startTime: args.overtimeInput.startTime,
      endTime: args.overtimeInput.endTime,
      duration: args.overtimeInput.duration,
      description: args.overtimeInput.description,
      creator: req.userId,
      approver: args.overtimeInput.approverId,
      status: args.overtimeInput.status
    });

    // let createdOvertime;

    try {
      const creator = await User.findById(req.userId);
      const approver = await User.findById(args.overtimeInput.approverId);

      if (!creator) {
        // throw new Error("User not found");
        return {
          ok: false,
          errors: [{ path: "creator", message: "User not found" }]
        }
      }
      if (!approver) {
        return {
          ok: false,
          errors: [{ path: "approver", message: "User not found" }]
        }
      }

      const result = await overtime.save();
      const createdOvertime = transformOvertime(result);

      approver.assignedOvertimes.push(overtime)
      await approver.save();

      creator.createdOvertimes.push(overtime);
      await creator.save();

      return { ok: true, overtime: createdOvertime };
    } catch (error) {
      // throw error;
      return {
        ok: false,
        errors: [{ path: error.path, message: error.message }]
      }
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
      // throw new Error("Not authenticated");
      return {
        ok: false,
        errors: [{ path: "creator", message: "User not found" }]
      }
    }

    try {
      const overtime = await Overtime.findById(args.overtimeId);
      await Overtime.deleteOne({ _id: args.overtimeId });
      // return transformOvertime(overtime);
      return { ok: true, overtime: transformOvertime(overtime) }
    } catch (error) {
      // throw error;
      return {
        ok: false,
        errors: [{ path: error.path, message: error.message }]
      }
    }
  }
};
