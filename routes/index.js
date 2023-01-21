var express = require('express');
var router = express.Router();
const mentorRouter = require('../src/mentors/route');
const authRouter = require('../src/authentication/authRoute');

router.use('/auth', authRouter);
router.use('/mentor', mentorRouter);

/* GET home page. */
router.use('/', (req, res) => {
  res.json({ hello: 'Welcome to StudyBuddy' });
});

module.exports = router;
