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
  .all(authenticate.verifyUser)
  .get(getSingleStudent)
  .put(updateStudent)
  .put(changeStudentPassword);

module.exports = router;
