var express = require('express');
var router = express.Router();
const mentorRouter = require('../src/mentors/route');

/* GET home page. */
router.use('/', (req, res) => {
  res.json({ hello: 'Welcome to StudyBuddy' });
});

router.use('/mentor', mentorRouter);

module.exports = router;
