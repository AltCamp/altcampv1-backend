const Joi = require('joi');

const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .messages({
      'string.pattern.base':
        'password must contain uppercase, lowercase, number and special character',
      'string.min': 'too short, lepa',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
}).with('email', 'password');

const createStudentValidator = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'Firstname is required',
    'any.required': 'Firstname is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Lastname is required',
    'any.required': 'Lastname is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .messages({
      'string.pattern.base':
        'password must contain uppercase, lowercase, number and special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  track: Joi.string().required().messages({
    'string.empty': 'Track is required',
    'any.required': 'Track is required',
  }),
  matric: Joi.string().allow('').optional(),
  stack: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),
});

const createMentorValidator = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'Firstname is required',
    'any.required': 'Firstname is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Lastname is required',
    'any.required': 'Lastname is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .messages({
      'string.pattern.base':
        'password must contain uppercase, lowercase, number and special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  track: Joi.string().required().messages({
    'string.empty': 'Track is required',
    'any.required': 'Track is required',
  }),
  matric: Joi.string().allow('').optional(),
  specialization: Joi.string().allow('').optional(),
  yearsOfExperience: Joi.number().allow('').optional(),
});

module.exports = {
  createMentorValidator,
  createStudentValidator,
  loginValidator,
};
