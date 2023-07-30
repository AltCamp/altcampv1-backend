const router = require('express').Router();
const TracksController = require('./tracksController');

router.route('/').get(TracksController.getTracks);

module.exports = router;
