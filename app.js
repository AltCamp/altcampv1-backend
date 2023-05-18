const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rateLimiter = require('express-rate-limit');
const { errorHandler } = require('./utils/errorHandler');
const cors = require('cors');
require('express-async-errors');

const indexRouter = require('./routes/index');

const limiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 50, // Limit each IP to 50 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

// applying rate limiting middleware to all requests
app.use(limiter);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://stdybdyv1.netlify.app',
      'https://altcampv1.netlify.app',
    ],
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ hello: 'Welcome to AltCamp' });
});

app.use('/', indexRouter);

// Error handler
app.use(errorHandler);

module.exports = app;
