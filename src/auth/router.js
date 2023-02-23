const router = require('express').Router();

const {
  registerMentor,
  registerStudent,
  userLogin,
  logout,
} = require('./auth');
const {
  studentValidatorMiddleware,
  mentorValidatorMiddleware,
  loginValidatorMiddleware,
} = require('../../middleware/validator');

router.post('/mentor', mentorValidatorMiddleware, registerMentor);
router.post('/student', studentValidatorMiddleware, registerStudent);
router.post('/login', loginValidatorMiddleware, userLogin);
router.post('/logout', logout);

module.exports = router;
