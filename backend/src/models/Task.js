const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Study", "Assignment", "Exam", "Personal", "Other"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);