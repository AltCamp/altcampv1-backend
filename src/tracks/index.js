const router = require('express').Router();
const tracks = require('./tracksController');

router.route('/').get(tracks.getTracks);

module.exports = router;
