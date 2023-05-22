const router = require('express').Router();
const { registerAccount, userLogin, userLogout } = require('./authController');
const limiter = require('../../middleware/rateLimit');

const { registerMentor, registerStudent } = require('./auth');
const {
  createAccountValidator,
  createMentorValidator,
  createStudentValidator,
  loginValidator,
} = require('./authValidator');
const validatorMiddleware = require('../../middleware/validator');

router.post(
  '/mentor',
  validatorMiddleware(createMentorValidator),
  registerMentor
);
router.post(
  '/student',
  validatorMiddleware(createStudentValidator),
  registerStudent
);
router.post('/logout', userLogout);
router.use(limiter());
router.post('/login', validatorMiddleware(loginValidator), userLogin);
router.post(
  '/register',
  validatorMiddleware(createAccountValidator),
  registerAccount
);

module.exports = router;
