const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const {
  updatePasswordValidatorMiddleware,
  updateProfileValidatorMiddleware,
} = require('../../middleware/validator');

const {
  getStudents,
  getSingleStudent,
  updateStudent,
  changeStudentPassword,
} = require('./studentController');

router.route('/').get(getStudents);
router.route('/:id').get(getSingleStudent);

router.use(verifyUser);
router
  .route('/change-password')
  .put(updatePasswordValidatorMiddleware, changeStudentPassword);
router
  .route('/update-profile')
  .put(updateProfileValidatorMiddleware, updateStudent);

module.exports = router;
