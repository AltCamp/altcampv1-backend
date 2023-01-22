const express = require('express');
const router = express.Router();
const mentorRouter = require('../src/mentors/route');
const studentRouter = require('../src/students/route');
const altStudentRouter = require('../src/altStudents/altStudentRoute');

router.use('/student', studentRouter);
router.use('/alt_student', altStudentRouter);
router.use('/mentor', mentorRouter);

/* GET home page. */
router.use('/', (req, res) => {
  res.json({ hello: 'Welcome to StudyBuddy' });
});

module.exports = router;
