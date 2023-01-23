const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');

const {
  getStudents,
  getSingleStudent,
  updateStudent,
  changeStudentPassword,
} = require('./studentController');

router.route('/').get(getStudents);

router
  .route('/:id')
  .get(getSingleStudent)
  .all(authenticate.verifyUser)
  .put(updateStudent, changeStudentPassword);

module.exports = router;
