const Joi = require('joi');

const createPostValidator = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
});

const updatePostValidator = Joi.object({
  content: Joi.string().optional(),
});

module.exports = {
  createPostValidator,
  updatePostValidator,
};
