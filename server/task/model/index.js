const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    expired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
