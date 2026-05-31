const express = require("express");
const router = express.Router();

const { aiChat } = require("../controllers/AI");
const { auth } = require("../middlewares/auth");

 console.log("error comes here");

// Route for AI Chat
router.post("/chat", auth, aiChat);

module.exports = router;
