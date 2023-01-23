const router = require('express').Router();

const { registerMentor, registerStudent, studentLogin } = require('./auth');

router.post('/mentor', registerMentor);

router.post('/student', registerStudent);
router.post('/student/login', studentLogin);


module.exports = router;