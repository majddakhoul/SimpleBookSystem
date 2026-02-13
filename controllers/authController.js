const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");

dotenv.config();

const {
  User,
  loginForUser,
  validateForRegister,
  updateUserInformation
} = require("../models/User");

/**
 * @desc Register For User Or Create One User
 * @route api/auth/register
 * @method POST
 * @access public
 */
const register = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length == 0) {
    return res
      .json({ message: "No data provided for register" })
      .status(400);
  }

  const { err } = validateForRegister(req.body);
  if (err) {
    return res
      .json({ message: err.details[0].message })
      .status(400);
  }

  let check = await User.findOne({ email: req.body.email });

  if (check) {
    return res
      .json({ message: "This email is already validated." })
      .status(400);
  }

  const crypt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, crypt);

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password
  });

  const resulte = await user.save();

  const token = jsonWebToken.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "4h" }
  );

  const { password, ...other } = resulte._doc;

  res.json({ ...other }, token);
});

/**
 * @desc Register For User Or Create One User
 * @route api/auth/register
 * @method POST
 * @access public
 */
const login = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length == 0) {
    return res
      .json({ message: "No data provided for register" })
      .status(400);
  }

  const { err } = loginForUser(req.body);
  if (err) {
    return res
      .json({ message: err.details[0].message })
      .status(400);
  }

  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .json({ message: "invalide Email or password." })
      .status(400);
  }

  const CheckPasswordIsMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!CheckPasswordIsMatched) {
    return res
      .json({ message: "invalide Email or password." })
      .status(400);
  }

  const token = jsonWebToken.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "4h" }
  );

  const { password, ...other } = user._doc;

  res.json({ ...other, token });
});

module.exports = {
  register,
  login
};
