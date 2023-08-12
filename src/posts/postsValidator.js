const Joi = require('joi');

const createPostValidator = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  tags: Joi.array().items(Joi.string()).min(1).max(3).optional().messages({
    'array.min': 'The tags array must have a minimum of 1 item',
    'array.max': 'The tags array must have a maximum of 3 items',
    'array.base':
      'The tags array must have a minimum of 1 item and a maximum of 3 items',
  }),
});

const updatePostValidator = Joi.object({
  content: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).min(1).max(3).optional().messages({
    'array.min': 'The tags array must have a minimum of 1 item',
    'array.max': 'The tags array must have a maximum of 3 items',
    'array.base':
      'The tags array must have a minimum of 1 item and a maximum of 3 items',
  }),
});

module.exports = {
  createPostValidator,
  updatePostValidator,
};
