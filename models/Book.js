const mongoose = require("mongoose");
const Joi = require("joi");

// Book Schema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author"
    },
    description: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
      default: null
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft-cover", "hard-cover"]
    }
  },
  {
    timestamps: true
  }
);

// Validate Create Book
function validateCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    author: Joi.string().required(),
    description: Joi.string().trim().min(3).max(100).required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().valid("soft-cover", "hard-cover").required()
  });

  return schema.validate(obj);
}

// Validate Update Book
function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(100).optional(),
    author: Joi.string().optional(),
    description: Joi.string().trim().min(3).max(500).optional(),
    price: Joi.number().min(0).optional(),
    cover: Joi.string().valid("soft-cover", "hard-cover").optional()
  });

  return schema.validate(obj);
}

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book, validateCreateBook, validateUpdateBook };
