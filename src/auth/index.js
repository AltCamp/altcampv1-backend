const router = require('express').Router();
const {
  registerAccount,
  userLogin,
  userLogout,
  verifyEmailOtp,
  verifyEmail,
} = require('./authController');
const limiter = require('../../middleware/rateLimit');
const {
  createAccountValidator,
  otpValidator,
  loginValidator,
} = require('./authValidator');
const validatorMiddleware = require('../../middleware/validator');
const { verifyUser } = require('../../middleware/authenticate');

router.post('/logout', userLogout);

router.use(limiter());

router.post('/login', validatorMiddleware(loginValidator), userLogin);

router.post('/verify-email', verifyUser, verifyEmail);
router.post(
  '/verify-otp',
  verifyUser,
  validatorMiddleware(otpValidator),
  verifyEmailOtp
);

router.post(
  '/register',
  validatorMiddleware(createAccountValidator),
  registerAccount
);

module.exports = router;
