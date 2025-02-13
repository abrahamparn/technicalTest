const express = require("express");
const testController = require("./test.controller");

const router = express.Router();

router.get("/", testController.getTestPage);

module.exports = router;
