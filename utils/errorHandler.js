function errorHandler(err, req, res, next) {
  console.log(err);
  let customError = {
    msg: err.msg || err.message || 'Something went wrong',
    statusCode: err.statusCode || 500,
    error: err.error || 'Something went wrong!',
  };

  if (err.name === 'CastError') {
    customError.msg = 'Not Found';
    customError.statusCode = 404;
  }

  if (err.name === 'ValidationError') {
    // check for omitted required fields and set statusCode to 400
    let errStatusCode = null;
    if (err.details && err.details[0].type === 'string.empty')
      errStatusCode = 400;
    customError.msg = err.errors
      ? Object.values(err.errors)
          .map((item) => item.message)
          .join('.   ')
      : err.details.map((item) => item.message).join('.   ');
    customError.statusCode = errStatusCode ? errStatusCode : 422;
    customError.statusCode === 422
      ? (customError.error = 'Validation Error')
      : true;
  }

  if (err.type === 'query' || err.type === 'params') {
    customError.statusCode = 422;
    customError.msg = err.error.details[0].message;
    customError.error = 'Validation Error';
  }

  if (err.code === 11000) {
    customError.statusCode = 409;
    customError.msg = `${Object.keys(err.keyPattern)[0]} already exists!`;
    customError.error = 'Conflict';
  }

  if (err.responseCode) {
    customError.statusCode = 500;
    customError.msg = 'Unable to send e-mail!';
    customError.error = 'Server error';
  }

  if (err.code === 'ENOENT') {
    customError.msg = 'Please contact the server administrator!';
  }

  res.status(customError.statusCode).json({
    statusCode: customError.statusCode,
    message: customError.msg,
    error: customError.error,
  });
  next();
}

module.exports = { errorHandler };
