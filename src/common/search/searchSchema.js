const Joi = require('joi');

const searchSchema = Joi.object().keys({
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  searchTerm: Joi.string().optional(),
  tags: Joi.string().optional(),
});

module.exports = searchSchema;
