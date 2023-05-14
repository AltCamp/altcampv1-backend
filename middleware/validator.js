const validate = async (validator, payload) => {
  await validator.validateAsync(payload, { abortEarly: false });
};

const validatorMiddleware = (validatorSchema) => async (req, res, next) => {
  const payload = req.body;
  try {
    await validate(validatorSchema, payload);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validatorMiddleware;
