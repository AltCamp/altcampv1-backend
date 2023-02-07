const Joi = require('joi');

const validate = async (validator, payload) => {
  await validator.validateAsync(payload, { abortEarly: false });
};

const studentValidatorMiddleware = async (req, res, next) => {
  const payload = req.body;
  try {
    await validate(studentValidator, payload);
    next();
  } catch (err) {
    next(err);
  }
};

const mentorValidatorMiddleware = async (req, res, next) => {
  const payload = req.body;
  try {
    await validate(mentorValidator, payload);
    next();
  } catch (err) {
    next(err);
  }
};

const loginValidatorMiddleware = async (req, res, next) => {
  const payload = req.body;
  try {
    await validate(loginValidator, payload);
    next();
  } catch (err) {
    next(err);
  }
};

const studentValidator = Joi.object({
  firstname: Joi.string().required().messages({
    'string.empty': 'Firstname is required',
    'any.required': 'Firstname is required'
  }),
  lastname: Joi.string().required().messages({
    'string.empty': 'Lastname is required',
    'any.required': 'Lastname is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  }),
  track: Joi.string().required().messages({
    'string.empty': 'Track is required',
    'any.required': 'Track is required'
  }),
  matric: Joi.string().allow('').optional(),
  stack: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),
});

const mentorValidator = Joi.object({
  firstname: Joi.string().required().messages({
    'string.empty': 'Firstname is required',
    'any.required': 'Firstname is required'
  }),
  lastname: Joi.string().required().messages({
    'string.empty': 'Lastname is required',
    'any.required': 'Lastname is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  }),
  track: Joi.string().required().messages({
    'string.empty': 'Track is required',
    'any.required': 'Track is required'
  }),
  matric: Joi.string().allow('').optional(),
  specialization: Joi.string().allow('').optional(),
  yearsOfExperience: Joi.number().allow('').optional()
});

const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Not a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  }),
}).with('email', 'password');

module.exports = {
  studentValidatorMiddleware,
  mentorValidatorMiddleware,
  loginValidatorMiddleware,
};
