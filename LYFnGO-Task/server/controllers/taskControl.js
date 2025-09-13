const Task = require("../models/taskSchme");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const addTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = new Task({ title, description, status, user: req.user });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.title = title;
    task.description = description;
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error.message);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

module.exports = { addTask, getTasks, getTaskById, updateTask, deleteTask };
