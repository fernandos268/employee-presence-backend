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
      throw new Error("Not authenticated");
    }

    const dayoff = new DayOff({
      dateFrom: new Date(args.dayoffInput.dateFrom),
      dateTo: new Date(args.dayoffInput.dateTo),
      description: args.dayoffInput.description,
      creator: req.userId,
      status: args.dayoffInput.status
    });

    let createdDayOff;
    try {
      const result = await dayoff.save();
      createdDayOff = transformDayoff(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User not found");
      }

      creator.createdDayOffs.push(dayoff);
      await creator.save();

      return createdDayOff;
    } catch (error) {
      throw error;
    }
  },
  updateDayOff: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not authenticated");
    }

    try {
      const dayoff = await DayOff.findById(args.updateDayOffInput._id);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found");
      }

      dayoff.status = args.updateDayOffInput.status;

      await dayoff.save();

      return transformDayoff(dayoff);
    } catch (error) {
      throw error;
    }
  },
  deleteDayOff: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not authenticated");
    }
    try {
      const dayoff = await DayOff.findById(args.dayOffId);
      await DayOff.deleteOne({ _id: args.dayOffId });
      return transformDayoff(dayoff);
    } catch (error) {
      throw error;
    }
  }
};
