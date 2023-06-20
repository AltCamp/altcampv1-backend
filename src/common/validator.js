const validator = require('express-joi-validation').createValidator({
  passError: true,
});

module.exports = validator;
