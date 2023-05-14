const Joi = require('joi');

const createQuestionValidator = Joi.object({
  title: Joi.string().required().min(16).max(100).messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  body: Joi.string().required().min(128).messages({
    'string.empty': 'Body is required',
    'any.required': 'Body is required',
  }),
});

const updateQuestionValidator = Joi.object({
  title: Joi.string().optional().min(16).max(100),
  body: Joi.string().optional().min(16),
});

module.exports = {
  createQuestionValidator,
  updateQuestionValidator,
};
