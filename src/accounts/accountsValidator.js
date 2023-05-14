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

module.exports = {
  passwordValidator,
  profileValidator,
};
