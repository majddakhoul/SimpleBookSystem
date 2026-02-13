const express = require("express");
const router = express.Router();

const {
  getForgetPasswordPage,
  sendForgetPasswordLink,
  GetResetPasswordView,
  resetThePassword
} = require("../controllers/passwordController");

// GET forget password page
router.get("/forget_password", getForgetPasswordPage);

// POST send forget password link
router.post("/forget_password", sendForgetPasswordLink);

// /password/reset-password/:userId/:token
// GET reset password view
router.route("/reset-password/:userId/:token").get(GetResetPasswordView);

// POST reset the password
router.route("/reset-password/:userId/:token").post(resetThePassword);

module.exports = router;
