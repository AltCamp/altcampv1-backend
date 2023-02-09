const router = require('express').Router();

const {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
} = require('./mentorController');

router.route('/').get(getMentors);

router
  .route('/:id')
  .get(getSingleMentor)
  .put(updateMentor)
  .put(changeMentorPassword);

module.exports = router;
