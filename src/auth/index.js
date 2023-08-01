const router = require('express').Router();
const {
  registerAccount,
  userLogin,
  userLogout,
  verifyEmail,
  requestEmailVerification,
} = require('./authController');
const limiter = require('../../middleware/rateLimit');
const {
  createAccountValidator,
  emailVerificationValidator,
  loginValidator,
} = require('./authValidator');
const validatorMiddleware = require('../../middleware/validator');
const { verifyUser } = require('../../middleware/authenticate');

router.post('/logout', userLogout);

router.use(limiter());

router.post('/login', validatorMiddleware(loginValidator), userLogin);

router.post('/start-email-verification', verifyUser, requestEmailVerification);
router.post(
  '/verify-email',
  verifyUser,
  validatorMiddleware(emailVerificationValidator),
  verifyEmail
);

router.post(
  '/register',
  validatorMiddleware(createAccountValidator),
  registerAccount
);

module.exports = router;
