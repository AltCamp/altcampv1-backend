const { ACCOUNT_TYPES } = require('../../constant');
const Account = require('../../model/account');
const { NotFoundError } = require('../../utils/customError');

async function getMentors(req, res) {
  const students = await Account.find({
    accountType: ACCOUNT_TYPES.MENTOR,
  }).populate('owner');
  res.json(students);
}

async function getSingleMentor(req, res) {
  const student = await Account.findOne({
    accountType: ACCOUNT_TYPES.MENTOR,
  }).populate('owner');
  res.json(student);
}

async function updateMentor(req, res) {
  const { firstname, lastname } = req.body;
  const stundent = await Account.findByIdAndUpdate(
    req.user.id,
    { firstname, lastname },
    { new: true }
  );
  if (!stundent) {
    throw new NotFoundError('Student not found!');
  }
  res.json(stundent);
}

async function changeMentorPassword(req, res) {
  const { password } = req.body;
  const student = await Account.findByIdAndUpdate(
    req.user.id,
    { password },
    { new: true }
  );
  if (!student) {
    throw new NotFoundError('Student not found!');
  }
  res.json(student);
}

module.exports = {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
};
