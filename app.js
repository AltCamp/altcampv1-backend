const express = require('express');
const Sentry = require('@sentry/node');
const initializeSentry = require('./middleware/sentry');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { Logger } = require('./utils');
const { errorHandler } = require('./utils/errorHandler');
const cors = require('cors');
require('express-async-errors');
const { ALT_CAMP } = require('./constant');
const indexRouter = require('./routes/index');
const app = express();

initializeSentry();

global.logger = Logger.createLogger({ label: ALT_CAMP });
require('./src/common/cache');

const appConfig = (app) => {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  app.use(cors());

  app.use(morgan('combined', { stream: logger.stream }));
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
};

appConfig(app);

module.exports = app;
