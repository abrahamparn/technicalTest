const logger = require("../../middleware/logger");
const taskModel = require("./task.model");
const { changeDate } = require("../../utils/dateHandler");

const createTask = async (req, res, next) => {
  try {
    const { title, description, due_date } = req.body;

    const taskId = await taskModel.createTask({
      title,
      description,
      due_date: changeDate(due_date),
    });

    return res.status(201).json({ message: "Task created", id: taskId });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

//! Needs to implement pagination
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskModel.getAllTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, due_date } = req.body;
    let formattedDueDate = changeDate(due_date);
    const affectedRows = await taskModel.updateTask(id, title, description, formattedDueDate);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "No task found or no changes made" });
    }
    return res.status(200).json({ message: "Task updated" });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskModel.deleteTask(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

const patchTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const affectedRows = await taskModel.patchTaskStatus(id, status);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ message: `Task status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  patchTaskStatus,
};
