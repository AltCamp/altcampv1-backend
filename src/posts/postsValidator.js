const Joi = require('joi');

const createPostValidator = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  tags: Joi.array().items(Joi.string()).min(1).optional().messages({
    'array.min': 'Tags must be an array with at least one item',
    'array.base': 'Tags must be an array with at least one item',
  }),
});

const updatePostValidator = Joi.object({
  content: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).min(1).optional().messages({
    'array.min': 'Tags must be an array with at least one item',
    'array.base': 'Tags must be an array with at least one item',
  }),
});

module.exports = {
  createPostValidator,
  updatePostValidator,
};
