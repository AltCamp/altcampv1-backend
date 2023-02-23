const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const {
  updateProfileValidatorMiddleware,
  updatePasswordValidatorMiddleware,
} = require('../../middleware/validator');

const {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
} = require('./mentorController');

router.route('/').get(getMentors);
router.route('/:id').get(getSingleMentor);

router.use(verifyUser);
router
  .route('/change-password')
  .put(updatePasswordValidatorMiddleware, changeMentorPassword);
router
  .route('/update-profile')
  .put(updateProfileValidatorMiddleware, updateMentor);

module.exports = router;
