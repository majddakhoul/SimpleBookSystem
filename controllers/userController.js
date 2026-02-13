const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const {
  User,
  updateUserInformation
} = require("../models/User");

/**
 * @description Update User information
 * @route api/users/:id
 * @method PUT
 * @access private
 */
const UpdateUserInfo = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length == 0) {
    return res
      .json({ message: "No data provided for register" })
      .status(400);
  }

  const { error } = updateUserInformation(req.body);

  if (error) {
    return res
      .json({ message: error.details[0].message })
      .status(400);
  }

  if (req.body.password) {
    const crypt = await bcrypt.genSalt(10);
    req.body.password = await crypt.hash(req.body.password, crypt);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
      }
    },
    { new: true }
  );

  const { password, ...other } = user._doc;

  res
    .json({ ...other })
    .status(200);
});

/**
 * @description GET All Users information
 * @route api/users
 * @method GET
 * @access private
 */
const GetAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res
    .json(users)
    .status(200);
});

/**
 * @description GET One User information
 * @route api/users/:id
 * @method GET
 * @access private
 */
const GetOneUserByID = asyncHandler(async (req, res) => {
  const user = await User
    .findById(req.params.id)
    .select("-password");

  if (!user) {
    return res.json({ message: "user not Found" });
  }

  res
    .json(user)
    .status(200);
});

/**
 * @description Delete One User information
 * @route api/users/:id
 * @method DELETE
 * @access private
 */
const DeleteOneUserByID = asyncHandler(async (req, res) => {
  const user = await User
    .findById(req.params.id)
    .select("-password");

  if (!user) {
    return res.json({ message: "user not Found" });
  }

  await User.findByIdAndDelete(req.params.id);

  res
    .json({ message: "delete successfully." })
    .status(200);
});

module.exports = {
  GetAllUser,
  GetOneUserByID,
  DeleteOneUserByID,
  UpdateUserInfo
};
