const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

class CommentsValidator {
  static validateCreateComment() {
    return Joi.object({
      content: Joi.string().required().min(1).messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
      }),
      postId: Joi.objectId().required().messages({
        'string.empty': 'postId is required',
        'any.required': 'postId is required',
      }),
    });
  }

  static validateGetComment() {
    return Joi.object({
      id: Joi.objectId().required().messages({
        'string.empty': 'postId is required',
        'any.required': 'postId is required',
      }),
    });
  }

  static validateGetComments() {
    return Joi.object({
      postId: Joi.objectId().required().messages({
        'string.empty': 'postId is required',
        'any.required': 'postId is required',
      }),
    });
  }

  static validateUpdateComment() {
    return Joi.object({
      content: Joi.string().required().min(3).messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
      }),
    });
  }
}

module.exports = { CommentsValidator };
