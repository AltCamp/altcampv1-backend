const express = require('express');
const router = express.Router();
const authRouter = require('../src/auth/router');
const studentRouter = require('../src/student/studentRoute');
const mentorRouter = require('../src/mentors/route');

router.use('/auth', authRouter);
router.use('/students', studentRouter);
router.use('/mentor', mentorRouter);

module.exports = router;
