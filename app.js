const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorHandler = require('./utils/errorHandler');

// Signup and login authentication middleware
require('./src/mentors/passport');
require('./src/students/passport');
require('./src/altStudents/passport');

const indexRouter = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);

// Error handler
app.use(errorHandler);

module.exports = app;
