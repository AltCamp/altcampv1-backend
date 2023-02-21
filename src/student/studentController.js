const { ACCOUNT_TYPES } = require('../../constant');
const Account = require('../../model/account');
const { NotFoundError } = require('../../utils/customError');
const { omit } = require('lodash');

async function getStudents(req, res) {
  const students = await Account.find({
    accountType: ACCOUNT_TYPES.STUDENT,
  }).populate('owner');
  res.json(students);
}

async function getSingleStudent(req, res) {
  const student = await Account.findById(req.params.id).populate('owner');

  if (!student || student.accountType !== ACCOUNT_TYPES.STUDENT) {
    throw new NotFoundError('Student not found!');
  }

  res.json(student);
}

async function updateStudent(req, res) {
  const { firstname, lastname } = req.body;
  const student = await Account.findByIdAndUpdate(
    req.user.id,
    { firstname, lastname },
    { new: true }
  );
  if (!student) {
    throw new NotFoundError('Student not found!');
  }
  res.json(student);
}

async function changeStudentPassword(req, res) {
  const { password } = req.body;

  let student = await Account.findById(req.user.id);
  if (!student) {
    throw new NotFoundError('Student not found!');
  }

  // save password from request
  student.password = password;
  await student.save();

  // prepare response data
  omit(student.toObject(), ['password']);
  student = omit(student.toObject(), ['password']);

  res.json(student);
}

module.exports = {
  getStudents,
  getSingleStudent,
  updateStudent,
  changeStudentPassword,
};
