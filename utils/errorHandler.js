function errorHandler(err, req, res, next) {
  let customError = {
    msg: err.msg || err.message || 'Something went wrong',
    statusCode: err.statusCode || 500,
  };
  if (err.name === 'ValidationError') {
    // check for omitted required fields and set statusCode to 400
    let errStatusCode = null;
    if (err.details[0].type === 'string.empty') errStatusCode = 400;

    customError.msg = err.errors
      ? Object.values(err.errors)
          .map((item) => item.message)
          .join('.   ')
      : err.details.map((item) => item.message).join('.   ');
    customError.statusCode = errStatusCode ? errStatusCode : 422;
  }
  res.status(customError.statusCode).json({
    msg: customError.msg,
  });
  next();
}

module.exports = { errorHandler };
