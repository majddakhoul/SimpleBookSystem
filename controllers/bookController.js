const Joi = require("joi");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const {
  Book,
  validateCreateBook,
  validateUpdateBook
} = require("../models/Book");

const { Author } = require("../models/Author");

/**
 * @desc Get All Authors
 * @route api/authors
 * @method GET
 * @access public 
 */
const GetAllBooks = asyncHandler(async (req, res) => {
  const ListBooks = await Book.find().populate(
    "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  );

  //first one to serach or to get query
  // const ListBooks = await Book.find({ price: 10 }).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //second way

  //$eq -> object in the mangoose db mean equal
  // const ListBooks = await Book.find({ price: {$eq:10}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //$ne -> object in the mangoose db mean not equal
  // const ListBooks = await Book.find({ price: {$ne:10}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //$lt -> object in the mangoose db mean less than
  // const ListBooks = await Book.find({ price: {$lt:10}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //$lte -> object in the mangoose db mean less than or equal
  // const ListBooks = await Book.find({ price: {$lte:10}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //$gt -> object in the mangoose db mean geater than
  // const ListBooks = await Book.find({ price: {$gt:10}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //$gte -> object in the mangoose db mean geater than or equal
  // const ListBooks = await Book.find({ price: {$gte:10}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //$in -> object in the mangoose db mean object in the array only
  // const ListBooks = await Book.find({ price: {$in:[8,9]}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //$nin -> object in the mangoose db mean object not in the array only
  // const ListBooks = await Book.find({ price: {$nin:[8,9]}}).populate(
  //   "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  // );

  //query came from front end
  //has two attributes
  // const { minPrice, maxPrice } = req.query;

  /**
     * let books
     * if(minPrice && maxPrice){
     *     get all the books that price is between minP and maxP
     *     const books = await Book.find({price: {$gte: minPrice, $lte: maxPrice}})
     * } else {
     * const ListBooks = await Book.find().populate(
      "author" /*["_id","firstName","lastName"] this is to get some colum from the object
      );}
     * 
     */

  //https://www.mongodb.com/docs/manual/reference/operator/query-comparison/
  // for query comparison operations

  if ((await ListBooks).length == 0) {
    return res.json({
      message: "There is noting to show.",
      data: null,
      status: 200,
      success: true
    });
  }

  return res.json({
    message: "Books fetched successfully.",
    data: ListBooks,
    status: 200,
    success: true
  });
});

/**
 * @desc Get All Books
 * @route api/books
 * @method GET
 * @access public 
 */
// router.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const ListBooks = await Book.find().populate(
//       "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
//     );

//     if ((await ListBooks).length == 0) {
//       return res.json({
//         message: "There is noting to show.",
//         data: null,
//         status: 200,
//         success: true
//       });
//     }

//     return res.json({
//       message: "Books fetched successfully.",
//       data: ListBooks,
//       status: 200,
//       success: true
//     });
//   })
// );

/**
 * @desc Get One Book
 * @route api/books/:id
 * @method GET
 * @access public 
 */
const GetOneBookByID = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const book = await Book.findById(id).populate(
    "author" /*["_id","firstName","lastName"] this is to get some colum from the object*/
  );

  if (!book) {
    return res.json({
      message: "Book Not Found",
      data: book,
      status: 404,
      success: false
    });
  }

  return res.json({
    message: "Book feteched successfully.",
    data: book,
    status: 200,
    success: true
  });
});

/**
 * @desc Create One Book
 * @route api/books
 * @method POST
 * @access private 
 */
const CreateOneBook = asyncHandler(async (req, res) => {
  // Validate that author is a valid ObjectId
  if (!mongoose.isValidObjectId(req.body.author)) {
    return res.status(400).json({
      message: "Invalid Author ID format",
      data: null,
      success: false,
      status: 400
    });
  }

  const author = await Author.findById(req.body.author);

  if (!author) {
    return res.status(404).json({
      message: "Author Not Found",
      data: null,
      success: false,
      status: 404
    });
  }

  const { error } = validateCreateBook(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
      status: 400
    });
  }

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    cover: req.body.cover,
    price: req.body.price
  });

  const result = await book.save();

  res.status(201).json({
    message: "Book created successfully",
    data: result,
    success: true,
    status: 201
  });
});

/**
 * @desc Update One Book
 * @route api/books/:id
 * @method PUT
 * @access private 
 */
const UpdateOneBookByID = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (req.body.author) {
    const author = await Author.findById(req.body.author);

    if (!author) {
      return res.status(404).json({
        message: "Author Not Found",
        data: null,
        success: false,
        status: 404
      });
    }
  }

  const book = await Book.findById(id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No data provided for update" });
  }

  const { error } = validateUpdateBook(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  const result = await Book.findByIdAndUpdate(
    id,
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        cover: req.body.cover,
        price: req.body.price
      }
    },
    { new: true }
  );

  res.status(200).json(result);
});

/**
 * @desc Delete One Book
 * @route api/books/:id
 * @method DELETE
 * @access private 
 */
const DeleteOneBookByID = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const bookIndex = await Book.findById(id);

  if (!bookIndex) {
    return res.status(404).json({ message: "Book not found" });
  }

  await Book.findByIdAndDelete(id);

  res.status(200).json({ message: "Book deleted successfully" });
});

module.exports = {
  GetAllBooks,
  UpdateOneBookByID,
  CreateOneBook,
  GetOneBookByID,
  DeleteOneBookByID
};
