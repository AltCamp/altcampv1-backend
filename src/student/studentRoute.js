const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');

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
  .put(validatorMiddleware('passwordValidator'), changeStudentPassword);
router
  .route('/update-profile')
  .put(validatorMiddleware('profileValidator'), updateStudent);

module.exports = router;
