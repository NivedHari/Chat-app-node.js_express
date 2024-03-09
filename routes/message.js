const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

const messageController = require("../controllers/message");
const AuthenticationHandler = require("../middlewares/auth");

router.post(
  "/send",
  AuthenticationHandler.authenticateUser,
  upload.single("image"),
  messageController.sendMessage
);

router.get(
  "/",
  AuthenticationHandler.authenticateUser,
  messageController.getMessage
);

module.exports = router;
