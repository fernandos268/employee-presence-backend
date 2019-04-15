const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dayOffSchema = new Schema({
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("DayOff", dayOffSchema);
