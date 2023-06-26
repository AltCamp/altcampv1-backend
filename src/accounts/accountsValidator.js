const Joi = require('joi');
const {
  ACCOUNT_TYPES,
  REGEX_PATTERNS,
  TRACKS,
  MEDIA_SIZE_LIMITS,
  VALID_IMAGE_FORMATS,
} = require('../../constant');
const { paginationSchema } = require('../common');

const getAccountsValidator = paginationSchema.keys({
  category: Joi.string()
    .optional()
    .valid(...Object.values(ACCOUNT_TYPES)),
});

const passwordValidator = Joi.object({
  oldPassword: Joi.string().required(),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(REGEX_PATTERNS.PASSWORD)
    .messages({
      'string.pattern.base':
        'password must contain uppercase, lowercase, number and special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  retypePassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Password and retype password must match',
  }),
});

const profileBioValidator = Joi.object({
  bio: Joi.string().allow('').required(),
});

const profileValidator = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  track: Joi.string()
    .valid(...Object.values(TRACKS))
    .optional(),
});

const imageValidator = Joi.object({
  profilePicture: Joi.string()
    .regex(REGEX_PATTERNS.BASE64IMAGE)
    .max(MEDIA_SIZE_LIMITS.PROFILEPICTURE)
    .required()
    .messages({
      'string.max': 'Image size should not exceed 500KB!',
      'string.pattern.base': `Please use a valid image format. Valid formats include: ${Object.values(
        VALID_IMAGE_FORMATS
      ).join(', ')}`,
      'any.required': `Please use a valid image format. Valid formats include: ${Object.values(
        VALID_IMAGE_FORMATS
      ).join(', ')}`,
    }),
});

const deleteAccountValidator = Joi.object({
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
});

const resetPasswordValidator = Joi.object({
  token: Joi.string()
    .regex(/^\d{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Token is invalid',
      'any.required': 'Token is required',
    }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(REGEX_PATTERNS.PASSWORD)
    .messages({
      'string.pattern.base':
        'password must contain uppercase, lowercase, number and special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  retypePassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords must match',
  }),
});

module.exports = {
  deleteAccountValidator,
  getAccountsValidator,
  imageValidator,
  passwordValidator,
  profileBioValidator,
  profileValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
