const router = require('express').Router();

const {
  registerMentor,
  registerStudent,
  userLogin,
  logout,
} = require('./auth');
const {
  createMentorValidator,
  createStudentValidator,
  loginValidator,
} = require('./auth.validator');
const validatorMiddleware = require('../../middleware/validator');

router.post('/mentor', validatorMiddleware(createMentorValidator), registerMentor);
router.post(
  '/student',
  validatorMiddleware(createStudentValidator),
  registerStudent
);
router.post('/login', validatorMiddleware(loginValidator), userLogin);
router.post('/logout', logout);

module.exports = router;
