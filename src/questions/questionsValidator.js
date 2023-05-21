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
});

const updateQuestionValidator = Joi.object({
  title: Joi.string().optional().max(100),
  body: Joi.string().optional(),
});

module.exports = {
  createQuestionValidator,
  updateQuestionValidator,
};
