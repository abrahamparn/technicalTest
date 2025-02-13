const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// implement logger, config, errorHandler,
const { unknownEndpoint } = require("./middleware/middleware");
const errorHandler = require("./middleware/errorHandler");

// Route
const testRouter = require("./modules/test/test.router");
const taskRouter = require("./modules/task/task.router");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test Routes (only in test environment)
if (process.env.NODE_ENV === "test") {
  app.use("/api/test", testRouter);
}

app.use("/api/tasks", taskRouter);

// Handle Unknown Endpoints
app.use(unknownEndpoint);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
