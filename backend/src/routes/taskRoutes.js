const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

// Create task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Get single task
router.get("/:id", getTaskById);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

module.exports = router;