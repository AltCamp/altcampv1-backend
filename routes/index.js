const express = require('express');
const router = express.Router();
// const mentorRouter = require('../src/mentors/route');
const authRouter = require('../src/auth/router');

/* GET home page. */

router.use('/auth', authRouter);
// router.use('/mentor', mentorRouter);



module.exports = router;
