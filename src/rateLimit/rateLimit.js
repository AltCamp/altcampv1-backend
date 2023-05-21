const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 50, // Limit each IP to 50 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


module.exports = limiter;
