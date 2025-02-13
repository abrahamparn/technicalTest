const express = require("express");
const taskController = require("./task.controller");
const validation = require("../../middleware/validation");

const router = express.Router();

router.post("/", validation.validateTaskCreate, taskController.createTask);
router.get("/", taskController.getAllTasks);
router.put("/:id", validation.validateTaskCreate, taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.patch("/:id", validation.validateTaskPatchStatus, taskController.patchTaskStatus);

module.exports = router;
