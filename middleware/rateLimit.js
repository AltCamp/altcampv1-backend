const rateLimiter = require('express-rate-limit');

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
  });
}

module.exports = limiter;
