const { ACCOUNT_TYPES } = require('../../constant');
const Account = require('../../model/account');
const { NotFoundError } = require('../../utils/customError');

async function getMentors(req, res) {
  const mentors = await Account.find({
    accountType: ACCOUNT_TYPES.MENTOR,
  }).populate('owner');
  res.json(mentors);
}

async function getSingleMentor(req, res) {
  const mentor = await Account.findOne({
    accountType: ACCOUNT_TYPES.MENTOR,
  }).populate('owner');
  res.json(mentor);
}

async function updateMentor(req, res) {
  const { firstname, lastname } = req.body;
  const mentor = await Account.findByIdAndUpdate(
    req.user.id,
    { firstname, lastname },
    { new: true }
  );
  if (!mentor) {
    throw new NotFoundError('Mentor not found!');
  }
  res.json(mentor);
}

async function changeMentorPassword(req, res) {
  const { password } = req.body;
  const mentor = await Account.findByIdAndUpdate(
    req.user.id,
    { password },
    { new: true }
  );
  if (!mentor) {
    throw new NotFoundError('Mentor not found!');
  }
  res.json(mentor);
}

module.exports = {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
};
