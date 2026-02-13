const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/authController");

// Register Route
router.route("/register").post(register);

// Login Route
router.route("/loginUser").post(login);

module.exports = router;
