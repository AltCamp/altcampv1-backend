const router = require('express').Router();
const { registerAccount, userLogin, userLogout } = require('./authController');
const limiter = require('../../middleware/rateLimit');
const { createAccountValidator, loginValidator } = require('./authValidator');
const validatorMiddleware = require('../../middleware/validator');

router.post('/logout', userLogout);

router.use(limiter());

router.post('/login', validatorMiddleware(loginValidator), userLogin);

router.post(
  '/register',
  validatorMiddleware(createAccountValidator),
  registerAccount
);

module.exports = router;
