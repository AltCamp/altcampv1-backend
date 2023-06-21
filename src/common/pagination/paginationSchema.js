const Joi = require('joi');

const paginationSchema = Joi.object().keys({
  limit: Joi.number().integer().min(1).max(100).optional(),
  page: Joi.number().integer().min(1).optional(),
});

module.exports = paginationSchema;
