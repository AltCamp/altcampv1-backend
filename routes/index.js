const express = require('express');
const router = express.Router();
const authRouter = require('../src/auth');
const studentRouter = require('../src/students');
const mentorRouter = require('../src/mentors/route');
const apiDocs = require('../src/docs');
const questionsRouter = require('../src/questions');

router.use('/auth', authRouter);
router.use('/students', studentRouter);
router.use('/mentors', mentorRouter);
router.use('/questions', questionsRouter);
router.use('/api-docs', apiDocs);

module.exports = router;
