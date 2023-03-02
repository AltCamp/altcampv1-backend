const Joi = require('joi');

const validate = async (validator, payload) => {
  await validator.validateAsync(payload, { abortEarly: false });
};

const updateQuestionValidator = async (req, _res, next) => {
  const payload = req.body;
  try {
    await validate(questionUpdate, payload);
    next();
  } catch (err) {
    next(err);
  }
};

const createQuestionValidator = async (req, _res, next) => {
  const payload = req.body;
  try {
    await validate(question, payload);
    next();
  } catch (err) {
    next(err);
  }
};

const question = Joi.object({
  title: Joi.string().required().min(16).max(100).messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  body: Joi.string().required().min(128).messages({
    'string.empty': 'Body is required',
    'any.required': 'Body is required',
  }),
});

const questionUpdate = Joi.object({
  title: Joi.string().optional().min(16).max(100),
  body: Joi.string().optional().min(16),
});

module.exports = {
  createQuestionValidator,
  updateQuestionValidator,
};
