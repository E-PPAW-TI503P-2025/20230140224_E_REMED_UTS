// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Register via Postman
router.post("/register", authController.register);

// Login via web
router.post("/login", authController.login);

module.exports = router;
