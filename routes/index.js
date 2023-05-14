const express = require('express');
const router = express.Router();
const authRouter = require('../src/auth');
const studentRouter = require('../src/students');
const mentorRouter = require('../src/mentors');
const apiDocs = require('../src/docs');
const questionsRouter = require('../src/questions');
const answersRouter = require('../src/answers');

router.use('/auth', authRouter);
router.use('/students', studentRouter);
router.use('/mentors', mentorRouter);
router.use('/questions', questionsRouter);
router.use('/answers', answersRouter);
router.use('/api-docs', apiDocs);

module.exports = router;
