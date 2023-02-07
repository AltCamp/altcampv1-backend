function errorHandler(err, req, res, next) {
  let customError = {
    msg: err.msg || err.message || 'Something went wrong',
    statusCode: err.statusCode || 500,
  };
  if (err.name === 'ValidationError') {
    customError.msg = err.errors
      ? Object.values(err.errors).map((item) => item.message).join('.   ')
      : err.details.map((item) => item.message).join('.   ');
    customError.statusCode = 422;
  }
  res.status(customError.statusCode).json({
    msg: customError.msg,
  });
  next();
}

module.exports = { errorHandler };
