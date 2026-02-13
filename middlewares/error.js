/**
 * @desc Handle Not Found Routes
 */
const notFound = function (req, res, next) {
  const err = new Error(`Not Found Route: ${req.originalUrl}`);
  res.status(404);
  next(err);
};

/**
 * @desc General Error Handler
 */
const errorHandler = function (err, req, res, next) {
  const statusCode =
    res.statusCode === 200 ? (res.statusCode = 500) : res.statusCode;

  res
    .status(statusCode)
    .json({ message: err.message });
};

module.exports = {
  errorHandler,
  notFound
};
