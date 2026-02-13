const Joi = require("joi");
const mongoose = require("mongoose");
const jsonWebToken = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");

// User Schema
const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      maxlength: 100,
      minlength: 10,
      required: true,
      trim: true,
      unique: true
    },
    userName: {
      type: String,
      maxlength: 100,
      minlength: 4,
      required: true,
      trim: true
    },
    password: {
      type: String,
      maxlength: 100,
      minlength: 8,
      required: true,
      trim: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Generate JWT Token
UserSchema.methods.generateToken = function() {
  return jsonWebToken.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "4h" }
  );
};

// Validate User Registration
function validateForRegister(obj) {
  const Schema = Joi.object({
    userName: Joi.string().trim().min(4).max(100).required(),
    email: Joi.string().trim().max(100).min(10).required().email(),
    password: passwordComplexity().required()
  });

  return Schema.validate(obj);
}

// Validate User Update
function updateUserInformation(obj) {
  const Schema = Joi.object({
    userName: Joi.string().trim().min(4).max(100),
    email: Joi.string().trim().max(100).min(10).email(),
    password: passwordComplexity().required()
  });

  return Schema.validate(obj);
}

// Validate User Login
function loginForUser(obj) {
  const Schema = Joi.object({
    email: Joi.string().trim().max(100).min(10).required().email(),
    password: Joi.string().trim().min(6).max(100)
  });
  return Schema.validate(obj);
}

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  loginForUser,
  validateForRegister,
  updateUserInformation
};
