/**
 * @desc Log Request Info Middleware
 */
const reqInfo = function (req, res, next) {
  console.log(`${req.method} -- ${req.protocol}://${req.host}${req.originalUrl}`);
  next();
};

module.exports = reqInfo;
