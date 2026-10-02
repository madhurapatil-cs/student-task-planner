const Task = require("../models/Task");
const mongoose = require("mongoose");

// Create a new task
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      category,
      priority,
      status,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Completion status filter
    if (status === "completed") {
      filter.isCompleted = true;
    } else if (status === "pending") {
      filter.isCompleted = false;
    }

    // Sorting
    const sortOrder = order === "asc" ? 1 : -1;

    const allowedSortFields = [
      "dueDate",
      "priority",
      "createdAt",
    ];

    const selectedSort =
      allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const tasks = await Task.find(filter).sort({
      [selectedSort]: sortOrder,
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
const getTaskById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Update task
const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};