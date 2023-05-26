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
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

const imageValidator = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().valid('7bit', '8bit', 'binary', 'base64').required(),
  mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
  size: Joi.number().required(),
}).options({ allowUnknown: true });

const deleteAccountValidator = Joi.object({
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

module.exports = {
  deleteAccountValidator,
  imageValidator,
  passwordValidator,
  profileValidator,
};
