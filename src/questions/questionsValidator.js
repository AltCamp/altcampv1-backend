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
  tags: Joi.array().items(Joi.string()).min(1).max(3).optional().messages({
    'array.min': 'The tags array must have a minimum of 1 item',
    'array.max': 'The tags array must have a maximum of 3 items',
    'array.base':
      'The tags array must have a minimum of 1 item and a maximum of 3 items',
  }),
});

const updateQuestionValidator = Joi.object({
  title: Joi.string().optional().max(100),
  body: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).min(1).max(3).optional().messages({
    'array.min': 'The tags array must have a minimum of 1 item',
    'array.max': 'The tags array must have a maximum of 3 items',
    'array.base':
      'The tags array must have a minimum of 1 item and a maximum of 3 items',
  }),
});

module.exports = {
  createQuestionValidator,
  updateQuestionValidator,
};
