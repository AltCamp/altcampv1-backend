const { ACCOUNT_TYPES, RESPONSE_MESSAGE } = require('../../constant');
const studentsService = require('./studentsService');
const { NotFoundError } = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');

async function getStudents(req, res) {
  const students = await studentsService.getStudents();

  new responseHandler(res, students, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function getSingleStudent(req, res) {
  const { id } = req.params;
  const student = await studentsService.getSingleStudent(id);

  if (!student || student.accountType !== ACCOUNT_TYPES.STUDENT) {
    throw new NotFoundError('Student not found!');
  }

  new responseHandler(res, student, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function updateStudent(req, res) {
  const payload = { ...req.body };
  const student = await studentsService.updateStudent({
    id: req.user.id,
    payload,
  });
  if (!student) {
    throw new NotFoundError('Student not found!');
  }
  new responseHandler(res, student, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function changeStudentPassword(req, res) {
  const { password } = req.body;

  const updatedStudent = await studentsService.changeStudentPassword({
    id: req.user.id,
    password,
  });
  if (!updatedStudent) {
    throw new NotFoundError('Student not found!');
  }

  new responseHandler(res, updatedStudent, 200, RESPONSE_MESSAGE.SUCCESS);
}

module.exports = {
  getStudents,
  getSingleStudent,
  updateStudent,
  changeStudentPassword,
};
