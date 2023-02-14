const { ACCOUNT_TYPES } = require('../../constant');
const Account = require('../../model/account');
const { NotFoundError } = require('../../utils/customError');

async function getStudents(req, res) {
  const students = await Account.find({
    accountType: ACCOUNT_TYPES.STUDENT,
  }).populate('owner');
  res.json(students);
}

async function getSingleStudent(req, res) {
  const student = await Account.findOne({
    accountType: ACCOUNT_TYPES.STUDENT,
    _id: req.user?.id || req.params.id,
  }).populate('owner');
  if (!student) throw new NotFoundError('Student not found!');
  res.json(student);
}

async function updateStudent(req, res) {
  const { firstname, lastname } = req.body;
  const student = await Account.findByIdAndUpdate(
    req.user?.id || req.params.id,
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
  const student = await Account.findByIdAndUpdate(
    req.user?.id || req.params.id,
    { password },
    { new: true }
  );
  if (!student) {
    throw new NotFoundError('Student not found!');
  }
  res.json(student);
}

module.exports = {
  getStudents,
  getSingleStudent,
  updateStudent,
  changeStudentPassword,
};
