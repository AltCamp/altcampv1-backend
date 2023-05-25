const Joi = require('joi');
const { ACCOUNT_TYPES, REGEX_PATTERNS, TRACKS } = require('../../constant');

const getAccountsValidator = Joi.object({
  category: Joi.string()
    .valid(...Object.values(ACCOUNT_TYPES))
    .default(ACCOUNT_TYPES.STUDENT),
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
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().valid('7bit', '8bit', 'binary', 'base64').required(),
  mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
  size: Joi.number().required(),
}).options({ allowUnknown: true });

module.exports = {
  getAccountsValidator,
  imageValidator,
  passwordValidator,
  profileBioValidator,
  profileValidator,
};
