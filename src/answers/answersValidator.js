const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createAnswerValidator = Joi.object({
  content: Joi.string().required().min(3).messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
  questionId: Joi.objectId().required().messages({
    'string.empty': 'questionId is required',
    'any.required': 'questionId is required',
  }),
});

const getAnswerValidator = Joi.object({
  id: Joi.objectId().required().messages({
    'string.empty': 'questionId is required',
    'any.required': 'questionId is required',
  }),
});

const getAnswersValidator = Joi.object({
  questionId: Joi.objectId().required().messages({
    'string.empty': 'questionId is required',
    'any.required': 'questionId is required',
  }),
});

const updateAnswerValidator = Joi.object({
  content: Joi.string().required().min(3).messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
});

module.exports = {
  createAnswerValidator,
  getAnswerValidator,
  getAnswersValidator,
  updateAnswerValidator,
};
