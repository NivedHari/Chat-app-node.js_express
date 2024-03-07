const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const AuthenticationHandler = require("../middlewares/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get(
  "/getusers",
  AuthenticationHandler.authenticateUser,
  userController.getAllUsers
);
router.post(
  "/create-group",
  AuthenticationHandler.authenticateUser,
  userController.createGroup
);
router.post(
  "/edit-group",
  AuthenticationHandler.authenticateUser,
  userController.editGroup
);
router.get(
  "/getGroups",
  AuthenticationHandler.authenticateUser,
  userController.getMyGroups
);
router.get(
  "/get-group-messages",
  AuthenticationHandler.authenticateUser,
  userController.getGroupMessages
);
router.get(
  "/get-group",
  AuthenticationHandler.authenticateUser,
  userController.getGroup
);
router.get(
  "/get-group-details",
  AuthenticationHandler.authenticateUser,
  userController.getGroupDetails
);

module.exports = router;
