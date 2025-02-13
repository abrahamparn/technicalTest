require("dotenv").config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "test";

module.exports = {
  PORT,
  NODE_ENV,
};
