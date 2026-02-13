const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const passwordComplexity = require("joi-password-complexity");

const { User } = require("../models/User");

/**
 * @desc Get forget password view page
 * @route password/forget_password
 * @method GET
 * @access public
 */
const getForgetPasswordPage = asyncHandler((req, res) => {
  res.render("forget-password");
});

/**
 * @desc Send forget password link
 * @route password/forget_password
 * @method POST
 * @access public
 */
const sendForgetPasswordLink = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length == 0) {
    return res.json({ message: "No data provided for register" }).status(400);
  }

  const Schema = Joi.object({
    email: Joi.string().required()
  });

  const { error } = Schema.validate(req.body);

  if (error) {
    return res.json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;

  const token = jwt.sign(
    { id: user._id, email: user.email },
    secret,
    { expiresIn: "30m" }
  );

  const link = `http://localhost:8080/password/reset-password/${user._id}/${token}`;

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: user.email,
    subject: "Reset Password",
    html: `
      <div>
        <h4>Click on the link below to reset your password</h4>
        <p>
          ${link}
        </p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
      res.json({ message: "someting went wrong" });
    } else {
      console.log("Email sent:" + success.response);
      res.render("link-send");
    }
  });
});

/**
 * @desc Get reset password view
 * @route /password/reset-password/:user._id/:token
 * @method GET
 * @access public
 */
const GetResetPasswordView = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.json({ message: `Error: ${err.message}` });
  }
});

/**
 * @desc Reset the password
 * @route /password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
const resetThePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token, secret);

    // Validate the new password
    const Schema = Joi.object({
      password: passwordComplexity().required()
    });

    const { error } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user.password = req.body.password;
    await user.save();

    // Make sure the view file exists inside the views folder
    return res.render("success-password");
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return res.status(400).json({
      message: `Error: ${err.message}`
    });
  }
});

module.exports = {
  getForgetPasswordPage,
  sendForgetPasswordLink,
  GetResetPasswordView,
  resetThePassword
};
