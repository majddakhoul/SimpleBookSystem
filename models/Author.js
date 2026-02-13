const mongoose = require("mongoose");
const Joi = require("joi");

// Author Schema
const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: 100,
      minlength: 6,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      maxlength: 100,
      minlength: 6,
      required: true,
      trim: true
    },
    nationality: {
      type: String,
      minlength: 3,
      maxlength: 10,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: "avatar-image.png"
    }
  },
  {
    timestamps: true
  }
);

// Validation for Creating Author
function validateToCreateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(6).max(100).required(),
    lastName: Joi.string().trim().min(6).max(100).required(),
    nationality: Joi.string().trim().min(6).max(100).required()
  });
  return schema.validate(obj);
}

// Validation for Updating Author
function validateToUpdateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(6).max(100),
    lastName: Joi.string().trim().min(6).max(100),
    nationality: Joi.string().trim().min(6).max(100)
  });
  return schema.validate(obj);
}

const Author = mongoose.model("Author", AuthorSchema);

module.exports = { Author, validateToUpdateAuthor, validateToCreateAuthor };
