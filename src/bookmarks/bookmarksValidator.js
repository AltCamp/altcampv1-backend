const Joi = require('joi');
const { POST_TYPES } = require('../../constant');

class BookmarksValidator {
  static validateCreateBookmark() {
    return Joi.object({
      postType: Joi.string()
        .valid(...Object.values(POST_TYPES))
        .required()
        .messages({
          'string.empty': 'Post Type is required',
          'any.required': 'Post Type is required',
        }),
      postId: Joi.string().required().messages({
        'string.empty': 'ID of post is required',
        'any.required': 'ID of post is required',
      }),
    });
  }

  static validateDeleteBookmark() {
    return Joi.object({
      postId: Joi.string().required().messages({
        'string.empty': 'ID of bookmarked post is required',
        'any.required': 'ID of bookmarked post is required',
      }),
    });
  }

  static validateBulkDeleteBookmarks() {
    return Joi.object({
      bookmarkIds: Joi.array().items(Joi.string()).min(1).messages({
        'array.min':
          'bookmarkIds must be an array with at least one bookmark ID',
        'array.base':
          'bookmarkIds must be an array with at least one bookmark ID',
      }),
    });
  }

  static validateUpdateBookmarks() {
    return Joi.object({
      isRead: Joi.boolean().optional(),
    });
  }
}

module.exports = { BookmarksValidator };
