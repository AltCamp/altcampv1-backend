const express = require('express');
const Sentry = require('@sentry/node');
const initializeSentry = require('./middleware/sentry');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { errorHandler } = require('./utils/errorHandler');
const cors = require('cors');
require('express-async-errors');
const { CLIENT_URLS } = require('./constant');

const indexRouter = require('./routes/index');

const app = express();

initializeSentry();
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(
  cors({
    origin: Object.values(CLIENT_URLS),
  })
);
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Lets make magic! 🚀');
});

app.use('/', indexRouter);

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.statusCode === 404 || error.statusCode === 500) {
        return true;
      }
      return false;
    },
  })
);

app.use(errorHandler);

module.exports = app;
