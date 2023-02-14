const router = require('express').Router();

const {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
} = require('./mentorController');

router.route('/').get(getMentors);

router.route('/change-password/:id').put(changeMentorPassword);

router.route('/:id').get(getSingleMentor).put(updateMentor);

module.exports = router;
