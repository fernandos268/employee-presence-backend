const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  suffix: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event"
    }
  ],
  createdDayOffs: [
    {
      type: Schema.Types.ObjectId,
      ref: "DayOff"
    }
  ],
  assignedDayOffs: [
    {
      type: Schema.Types.ObjectId,
      ref: "DayOff"
    }
  ],
  createdOvertimes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Overtime"
    }
  ],
  assignedOvertimes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Overtime"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
