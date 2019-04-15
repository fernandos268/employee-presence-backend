const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
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
  createdOvertimes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Overtime"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
