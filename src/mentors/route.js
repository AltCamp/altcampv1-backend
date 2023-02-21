const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');

const {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
} = require('./mentorController');

router.route('/').get(getMentors);
router.route('/:id').get(getSingleMentor);

router.use(verifyUser);
router.route('/change-password').put(changeMentorPassword);
router.route('/update-profile').put(updateMentor);

module.exports = router;
