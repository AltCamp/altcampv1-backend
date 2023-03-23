const router = require('express').Router();

const {
  registerMentor,
  registerStudent,
  userLogin,
  logout,
} = require('./auth');
const validatorMiddleware = require('../../middleware/validator');

router.post('/mentor', validatorMiddleware('mentorValidator'), registerMentor);
router.post('/student', validatorMiddleware('studentValidator'), registerStudent);
router.post('/login', validatorMiddleware('loginValidator'), userLogin);
router.post('/logout', logout);

module.exports = router;
