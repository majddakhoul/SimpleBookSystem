const mongoose = require("mongoose");
const Joi = require("joi");
const asyncHandler = require("express-async-handler");

const {
  Author,
  validateToCreateAuthor,
  validateToUpdateAuthor
} = require("../models/Author");

/**
 * @desc Create One Author
 * @route api/authors
 * @method POST
 * @access private
 */
const CreateOneAuthor = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body) == 0) {
    return res.json({ message: "Validate Date to Create Author" });
  }

  const { error } = validateToCreateAuthor(req.body);

  if (error) {
    return res
      .json({ message: error.details[0].message })
      .status(400);
  }

  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    image: req.body.image
  });

  const resulte = await author.save();

  res
    .json({
      message: "Author created successfully",
      data: resulte,
      success: true,
      status: 201
    })
    .status(201);
});

/**
 * @desc Get All Authors
 * @route api/authors
 * @method GET
 * @access public
 */
const GetAllAuthors = asyncHandler(async (req, res) => {
  // const authors = await Author.find();

  const Schema = Joi.object({
    pageNumber: Joi.number()
  });

  const { error } = Schema.validate(req.query);

  if (error) {
    return res.json({ message: error.details[0] });
  }

  const { pageNumber } = req.query.pageNumber;

  const authorsPerPage = 2;

  const authors = await Author.find()
    .skip((pageNumber - 1) * authorsPerPage)
    .limit(authorsPerPage);

  res
    .json({
      message: "Authors fetched successfully",
      data: authors,
      success: true,
      status: 200
    })
    .status(200);
});

/**
 * @desc Get One Author By ID
 * @route api/authors/:id
 * @method GET
 * @access public
 */
const GetOneAuthorByID = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    return res.json({ message: "Author Not Found" });
  }

  res
    .json({
      message: "Author fetched successfully",
      data: author,
      success: true,
      status: 200
    })
    .status(200);
});

/**
 * @desc Update One Author By ID
 * @route api/authors/:id
 * @method PUT
 * @access private
 */
const UpdateOneAuthorByID = asyncHandler(async (req, res) => {
  // 1. Check if update data exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "No data provided for update" });
  }

  // 2. Validate author ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ message: "Invalid author ID format" });
  }

  // 3. Check if author exists
  const existingAuthor = await Author.findById(req.params.id);

  if (!existingAuthor) {
    return res
      .status(404)
      .json({ message: "Author not found" });
  }

  // 4. Validate update data
  const { error } = validateToUpdateAuthor(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message });
  }

  // 5. Update author data
  const updatedAuthor = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image
      }
    },
    { new: true } // return updated document
  );

  // 6. Return updated author
  return res.status(200).json(updatedAuthor);
});

/**
 * @desc Delete One Author By ID
 * @route api/authors/:id
 * @method DELETE
 * @access private
 */
const DeleteOneAuthorByID = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    return res.json({ message: "Author Not Found" });
  }

  await Author.findByIdAndDelete(req.params.id);

  return res.json({ message: "deleted succfully" });
});

module.exports = {
  GetAllAuthors,
  GetOneAuthorByID,
  UpdateOneAuthorByID,
  CreateOneAuthor,
  DeleteOneAuthorByID
};
