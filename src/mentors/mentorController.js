const { ACCOUNT_TYPES, RESPONSE_MESSAGE } = require('../../constant');
const Account = require('../../model/account');
const { NotFoundError } = require('../../utils/customError');
const { omit } = require('lodash');
const responseHandler = require('../../utils/responseHandler');

async function getMentors(req, res) {
  const mentors = await Account.find({
    accountType: ACCOUNT_TYPES.MENTOR,
  }).populate('owner');
  res.json(mentors);
}

async function getSingleMentor(req, res) {
  const mentor = await Account.findById(req.params.id);

  if (!mentor || mentor.accountType !== ACCOUNT_TYPES.MENTOR) {
    throw new NotFoundError('Mentor not found!');
  }

  new responseHandler(res, mentor, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function updateMentor(req, res) {
  const { firstname, lastname } = req.body;
  const mentor = await Account.findByIdAndUpdate(
    req.user.id,
    { firstname, lastname },
    { new: true }
  );
  if (!mentor || mentor.accountType !== ACCOUNT_TYPES.MENTOR) {
    throw new NotFoundError('Mentor not found!');
  }
  new responseHandler(res, mentor, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function changeMentorPassword(req, res) {
  const { password } = req.body;

  let mentor = await Account.findById(req.user.id);
  if (!mentor) {
    throw new NotFoundError('Mentor not found!');
  }

  // save password from request
  mentor.password = password;
  await mentor.save();

  // prepare response data
  omit(mentor.toObject(), ['password']);
  mentor = omit(mentor.toObject(), ['password']);

  new responseHandler(res, mentor, 200, RESPONSE_MESSAGE.SUCCESS);
}

module.exports = {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
};
