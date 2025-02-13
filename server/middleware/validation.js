const { param, query, body, validationResult } = require("express-validator");
const moment = require("moment");

// validation for create tasks and for update tasks
const validateTaskCreate = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("due_date").custom((value) => {
    // Define the expected format
    const format = "DD/MM/YYYY";
    // Check if the date matches the format and is valid
    if (!moment(value, format, true).isValid()) {
      throw new Error("Due date must be in dd/mm/yyyy format and a valid date");
    }

    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateTaskPatchStatus = [
  body("status")
    .notEmpty()
    .custom((value) => {
      let data = value.toLowerCase();
      if (data !== "completed" && data !== "pending") {
        throw new Error("status must be either 'Completed' or 'Pending'");
      }

      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateTaskCreate,
  validateTaskPatchStatus,
};
