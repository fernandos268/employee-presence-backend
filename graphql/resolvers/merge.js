// GRAPQL MODELS
const Event = require("../../models/event");
const User = require("../../models/user");
const DayOff = require("../../models/dayoff");
const Overtime = require("../../models/overtime");
// HELPERS
const { dateToString } = require("../../helpers/date");

// INTERNAL FUNCTIONS / USED ONLY INSIDE OF THIS FILE

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const dayoffs = async dayoffIds => {
  try {
    const dayoffs = await DayOff.find({ _id: { $in: dayoffIds } });
    return dayoffs.map(dayoff => {
      return transformDayoff(dayoff);
    });
  } catch (error) {
    throw error;
  }
};

const overtimes = async overtimeIds => {
  try {
    const overtimes = await Overtime.find({ _id: { $in: overtimeIds } });
    return overtimes.map(overtime => {
      return transformOvertime(overtime);
    });
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
      createdDayOffs: dayoffs.bind(this, user._doc.createdDayOffs),
      assignedDayOffs: dayoffs.bind(this, user._doc.assignedDayOffs),
      createdOvertimes: overtimes.bind(this, user._doc.createdOvertimes),
      assignedOvertimes: overtimes.bind(this, user._doc.assignedOvertimes)
    };
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

// EXPORTED FUNTCIONS / USED OR IMPORTED BY OTHER FILES

const transformUser = async user => {
  try {
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
      createdDayOffs: dayoffs.bind(this, user._doc.createdDayOffs),
      assignedDayOffs: dayoffs.bind(this, user._doc.assignedDayOffs),
      createdOvertimes: overtimes.bind(this, user._doc.createdOvertimes),
      assignedOvertimes: overtimes.bind(this, user._doc.assignedOvertimes)
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const transformDayoff = dayoff => {
  return {
    ...dayoff._doc,
    _id: dayoff.id,
    startDate: dateToString(dayoff._doc.startDate),
    endDate: dateToString(dayoff._doc.endDate),
    creator: user.bind(this, dayoff.creator),
    approver: user.bind(this, dayoff.approver)
  };
};

const transformOvertime = overtime => {
  return {
    ...overtime._doc,
    _id: overtime.id,
    date: dateToString(overtime._doc.date),
    creator: user.bind(this, overtime.creator),
    approver: user.bind(this, overtime.approver)
  };
};

exports.transformUser = transformUser;
exports.user = user;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformDayoff = transformDayoff;
exports.transformOvertime = transformOvertime;
