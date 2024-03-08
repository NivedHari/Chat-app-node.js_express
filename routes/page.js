const express = require("express");

const router = express.Router();

const pageController = require("../controllers/page");

router.get("/", pageController.getStartingPage);
router.get("/login", pageController.getloginPage);
router.get("/chat", pageController.getChatPage);
router.get("*", pageController.geterrorPage);

module.exports = router;
