var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Signup and login authentication middleware
require('./src/authentication/passport');

var indexRouter = require('./routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);

module.exports = app;
