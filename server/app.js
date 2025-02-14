const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

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

//This middleware below is for production
app.use(express.static(path.join(__dirname, "public")));

//This code below is to set so that the user does not have to change from index.html to the homepage
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle Unknown Endpoints
app.use(unknownEndpoint);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
