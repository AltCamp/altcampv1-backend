const express = require('express');
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { errorHandler } = require('./utils/errorHandler');
require('express-async-errors');

const swaggerJsDocs = YAML.load('./api-mentor.yaml');

const indexRouter = require('./routes/index');

const app = express();

app.use('/api-docs-mentor', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ hello: 'Welcome to StudyBuddy' });
});

app.use('/', indexRouter);

// Error handler
app.use(errorHandler);

module.exports = app;
