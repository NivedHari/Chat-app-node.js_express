const express = require("express");

const router = express.Router();

const messageController = require("../controllers/message");
const AuthenticationHandler = require("../middlewares/auth");

router.post(
  "/send",
  AuthenticationHandler.authenticateUser,
  messageController.sendMessage
);

module.exports = router;
