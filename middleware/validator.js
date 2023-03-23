const validatorSchema = require('../model/validator');

const validate = async (validator, payload) => {
  await validator.validateAsync(payload, { abortEarly: false });
};

const validatorMiddleware = (validatorSchemaName) => async (req, res, next) => {
  const payload = req.body;
  try {
    await validate(validatorSchema[validatorSchemaName], payload);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validatorMiddleware;
