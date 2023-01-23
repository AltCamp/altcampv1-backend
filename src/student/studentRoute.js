const router = require('express').Router();

const { getStudents } = require('./studentController');

router.route('/').get(getStudents);


module.exports = router;