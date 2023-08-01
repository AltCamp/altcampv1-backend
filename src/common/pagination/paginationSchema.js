const Joi = require('joi');
const searchSchema = require('../search/searchSchema');

const paginationSchema = searchSchema.keys({
  limit: Joi.number().integer().min(1).max(100).optional(),
  page: Joi.number().integer().min(1).optional(),
  sort: Joi.string().optional(),
  isPaginated: Joi.boolean().optional(),
  userId: Joi.string().optional(),
});

module.exports = paginationSchema;
