const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createCommentValidator = Joi.object({
  content: Joi.string().required().min(3).messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
  postId: Joi.objectId().required().messages({
    'string.empty': 'postId is required',
    'any.required': 'postId is required',
  }),
});

const getCommentValidator = Joi.object({
  id: Joi.objectId().required().messages({
    'string.empty': 'postId is required',
    'any.required': 'postId is required',
  }),
});

const getCommentsValidator = Joi.object({
  postId: Joi.objectId().required().messages({
    'string.empty': 'postId is required',
    'any.required': 'postId is required',
  }),
});

const updateCommentValidator = Joi.object({
  content: Joi.string().required().min(3).messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
});

module.exports = {
  createCommentValidator,
  getCommentValidator,
  getCommentsValidator,
  updateCommentValidator,
};
