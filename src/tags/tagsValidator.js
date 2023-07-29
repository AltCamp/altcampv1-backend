const Joi = require('joi');
const { paginationSchema } = require('../common');

class TagsValidator {
  static validateCreateTags() {
    return Joi.object({
      tags: Joi.array().items(Joi.string()).min(1).required(),
    });
  }

  static validateTags() {
    return paginationSchema.keys({
      tagName: Joi.string(),
    });
  }
}

module.exports = TagsValidator;
