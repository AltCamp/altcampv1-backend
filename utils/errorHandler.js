const logger = require('./logger');

/**
 * Error handler middleware
 */
module.exports = (error, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const errorObj = JSON.stringify(error, null, 2);
    logger.error(errorObj);
  }

  if (error.message === 'data and hash arguments required') {
    return res.status(403).json({
      status: 'fail',
      error: 'please provide password',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      error: 'token expired',
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      error: 'invalid token',
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      error: 'invalid id',
    });
  }

  res.status(400).json({
    status: 'fail',
    error: 'Oops, something went wrong!',
  });

  next();
};
