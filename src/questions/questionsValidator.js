const Joi = require('joi');

const createQuestionValidator = Joi.object({
  title: Joi.string().required().max(100).messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  body: Joi.string().required().messages({
    'string.empty': 'Body is required',
    'any.required': 'Body is required',
  }),
  tags: Joi.array().items(Joi.string()).min(1).optional().messages({
    'array.min': 'Tags must be an array with at least one item',
    'array.base': 'Tags must be an array with at least one item',
  }),
});

const updateQuestionValidator = Joi.object({
  title: Joi.string().optional().max(100),
  body: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).min(1).optional().messages({
    'array.min': 'Tags must be an array with at least one item',
    'array.base': 'Tags must be an array with at least one item',
  }),
});

module.exports = {
  createQuestionValidator,
  updateQuestionValidator,
};
