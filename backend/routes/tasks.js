const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// All task routes require a valid JWT
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks belonging to the logged-in user
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/tasks
// @desc    Create a new task for the logged-in user
router.post("/", async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (title, description, completed, dueDate)
router.put("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, completed, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
