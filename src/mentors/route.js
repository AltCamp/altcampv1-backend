const router = require('express').Router();
const verifyUser = require('../../middleware/verifyUserToken');

const {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
} = require('./mentorController');

router.route('/').get(verifyUser, getMentors);

router.route('/change-password/:id').put(verifyUser, changeMentorPassword);

router
  .route('/:id')
  .get(verifyUser, getSingleMentor)
  .put(verifyUser, updateMentor);

module.exports = router;
