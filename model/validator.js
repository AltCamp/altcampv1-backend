const Joi = require('joi');

const passwordValidator = Joi.object({
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
});

const profileValidator = Joi.object({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
});

const studentValidator = Joi.object({
  firstname: Joi.string().required().messages({
    'string.empty': 'Firstname is required',
    'any.required': 'Firstname is required',
  }),
  lastname: Joi.string().required().messages({
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

const mentorValidator = Joi.object({
  firstname: Joi.string().required().messages({
    'string.empty': 'Firstname is required',
    'any.required': 'Firstname is required',
  }),
  lastname: Joi.string().required().messages({
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
  passwordValidator,
  profileValidator,
  studentValidator,
  mentorValidator,
  loginValidator,
  createQuestionValidator,
  updateQuestionValidator,
};
