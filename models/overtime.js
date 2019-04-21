const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const overtimeSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
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
  approver: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Overtime", overtimeSchema);
