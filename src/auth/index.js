const router = require('express').Router();

const {
  registerMentor,
  registerStudent,
  userLogin,
  logout,
  updatePassword,
} = require('./auth');
const {
  createMentorValidator,
  createStudentValidator,
  loginValidator,
} = require('./authValidator');
const validatorMiddleware = require('../../middleware/validator');

const { verifyUser } = require('../../middleware/authenticate');

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
router.post('/login', validatorMiddleware(loginValidator), userLogin);
router.post('/logout', logout);

router.post('/update-password', verifyUser, updatePassword);

module.exports = router;
