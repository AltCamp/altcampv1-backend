const rateLimiter = require('express-rate-limit');
const responseHandler = require('../utils/responseHandler');

/**
 * Sets up rate limiting for requests
 *
 * @param {number} windowMs Time frame for which requests are checked
 * @param {number} max The maximum number of connections to allow during the window before rate limiting the client
 *
 */
function limiter(windowMs = 600000, max = 50) {
  return rateLimiter({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: (req, res) => {
      return new responseHandler(
        res,
        undefined,
        429,
        'Too many requests, please try again later'
      );
    },
  });
}

module.exports = limiter;
