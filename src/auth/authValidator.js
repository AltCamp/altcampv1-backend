const Joi = require('joi');
const {
  ACCOUNT_TYPES,
  GENDER,
  REGEX_PATTERNS,
  TRACKS,
} = require('../../constant');

const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(REGEX_PATTERNS.PASSWORD)
    .messages({
      'string.pattern.base':
        'password must contain uppercase, lowercase, number and special character',
      'string.min': 'too short, lepa',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
}).with('email', 'password');

const createAccountValidator = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(REGEX_PATTERNS.PASSWORD)
    .messages({
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number and special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  track: Joi.string()
    .valid(...Object.values(TRACKS))
    .required()
    .messages({
      'string.empty': 'Track is required',
      'any.required': 'Track is required',
    }),
  category: Joi.string()
    .valid(...Object.values(ACCOUNT_TYPES))
    .required(),
  altSchoolId: Joi.string()
    .pattern(REGEX_PATTERNS.ALT_SCHOOL_ID)
    .messages({
      'string.pattern.base': 'Please enter your AltSchool ID',
      'string.empty': 'Please enter your AltSchool ID',
    })
    .optional(),
  gender: Joi.string()
    .valid(...Object.values(GENDER))
    .optional(),
});

module.exports = {
  createAccountValidator,
  loginValidator,
};
