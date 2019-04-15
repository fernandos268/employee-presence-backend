const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const overtimeSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  timeFrom: {
    type: Date,
    required: true
  },
  timeTo: {
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

module.exports = mongoose.model("Overtime", overtimeSchema);
