const router = require('express').Router();

const { registerMentor, registerStudent, userLogin } = require('./auth');
const {
  studentValidatorMiddleware,
  mentorValidatorMiddleware,
  loginValidatorMiddleware,
} = require('../../middleware/validator');

router.post('/mentor', mentorValidatorMiddleware, registerMentor);
router.post('/student', studentValidatorMiddleware, registerStudent);
router.post('/login', loginValidatorMiddleware, userLogin);

module.exports = router;
