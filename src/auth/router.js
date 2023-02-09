const router = require('express').Router();

const { registerMentor, registerStudent, studentLogin } = require('./auth');
const {
  studentValidatorMiddleware,
  mentorValidatorMiddleware,
  loginValidatorMiddleware,
} = require('../../middleware/validator');

router.post('/mentor', mentorValidatorMiddleware, registerMentor);

router.post('/student', studentValidatorMiddleware, registerStudent);
router.post('/student/login', loginValidatorMiddleware, studentLogin);

module.exports = router;
