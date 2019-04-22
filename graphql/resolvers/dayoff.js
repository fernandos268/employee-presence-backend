// GraphQL Models
const DayOff = require("../../models/dayoff");
const User = require("../../models/user");

// Transform Response Data
const { transformDayoff } = require("./merge");

module.exports = {
  dayoffs: async () => {
    try {
      const dayoffs = await DayOff.find();
      return dayoffs.map(dayoff => {
        return transformDayoff(dayoff);
      });
    } catch (error) {
      throw error;
    }
  },
  createDayOff: async (args, req) => {
    if (!req.isAuth) {
      // throw new Error("Not authenticated");
      return {
        ok: false,
        errors: [{ path: "authentication", message: "Not authenticated" }]
      };
    }

    const dayoff = new DayOff({
      startDate: new Date(args.dayoffInput.startDate),
      endDate: new Date(args.dayoffInput.endDate),
      duration: args.dayoffInput.duration,
      description: args.dayoffInput.description,
      creator: req.userId,
      approver: args.dayoffInput.approverId,
      status: args.dayoffInput.status
    });

    // let createdDayOff;
    try {
      const creator = await User.findById(req.userId);
      const approver = await User.findById(args.dayoffInput.approverId);
      if (!creator) {
        // throw new Error("User not found");
        return {
          ok: false,
          errors: [{ path: "creator", message: "User not found" }]
        };
      }
      if (!approver) {
        return {
          ok: false,
          errors: [{ path: "approver", message: "User not found" }]
        };
      }

      const result = await dayoff.save();
      const createdDayOff = transformDayoff(result);

      creator.createdDayOffs.push(dayoff);
      await creator.save();

      approver.assignedDayOffs.push(dayoff);
      await approver.save();

      return { ok: true, dayoff: createdDayOff };
    } catch (error) {
      // throw error;
      return {
        ok: false,
        errors: [{ path: error.path, message: error.message }]
      };
    }
  },
  updateDayOff: async (args, req) => {
    if (!req.isAuth) {
      // throw new Error("Not authenticated");
      return {
        ok: false,
        errors: [{ path: "authentication", message: "Not authenticated" }]
      };
    }

    try {
      const dayoff = await DayOff.findById(args.dayOffId);
      const creator = await User.findById(req.userId);
      if (!creator) {
        // throw new Error("User not found");
        return {
          ok: false,
          errors: [{ path: "creator", message: "User not found" }]
        };
      }

      dayoff.status = args.status;

      await dayoff.save();

      return { ok: true, dayoff: transformDayoff(dayoff) };
    } catch (error) {
      // throw error;
      return {
        ok: false,
        errors: [{ path: error.path, message: error.message }]
      };
    }
  },
  deleteDayOff: async (args, req) => {
    if (!req.isAuth) {
      // throw new Error("Not authenticated");
      return {
        ok: false,
        errors: [{ path: "creator", message: "User not found" }]
      };
    }
    try {
      const dayoff = await DayOff.findById(args.dayOffId);
      await DayOff.deleteOne({ _id: args.dayOffId });
      // return transformDayoff(dayoff);
      return { ok: true, dayoff: transformDayoff(dayoff) };
    } catch (error) {
      throw error;
      // return {
      //   ok: false,
      //   errors: [{ path: error.path, message: error.message }]
      // };
    }
  }
};
