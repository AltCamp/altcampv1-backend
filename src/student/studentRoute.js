const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');

const {
  getStudents,
  getSingleStudent,
  updateStudent,
  changeStudentPassword,
} = require('./studentController');

router.route('/').get(getStudents);
router.route('/:id').get(getSingleStudent);

router.use(verifyUser);
router.route('/change-password').put(changeStudentPassword);
router.route('/update-profile').put(updateStudent);

module.exports = router;
