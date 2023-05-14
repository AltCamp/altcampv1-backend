const { ACCOUNT_TYPES, RESPONSE_MESSAGE } = require('../../constant');
const { NotFoundError } = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const mentorsService = require('./mentorsService');

async function getMentors(req, res) {
  const mentors = await mentorsService.getMentors();

  new responseHandler(res, mentors, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function getSingleMentor(req, res) {
  const { id } = req.params;

  const mentor = await mentorsService.getSingleMentor(id);

  if (!mentor || mentor.accountType !== ACCOUNT_TYPES.MENTOR) {
    throw new NotFoundError('Mentor not found!');
  }

  new responseHandler(res, mentor, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function updateMentor(req, res) {
  const payload = { ...req.body };
  const mentor = await mentorsService.updateMentor({
    id: req.user.id,
    payload,
  });
  if (!mentor || mentor.accountType !== ACCOUNT_TYPES.MENTOR) {
    throw new NotFoundError('Mentor not found!');
  }
  new responseHandler(res, mentor, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function changeMentorPassword(req, res) {
  const { password } = req.body;

  const updatedMentor = await mentorsService.changeMentorPassword({
    id: req.user.id,
    password,
  });
  if (!updatedMentor) {
    throw new NotFoundError('Student not found!');
  }

  new responseHandler(res, updatedMentor, 200, RESPONSE_MESSAGE.SUCCESS);
}

module.exports = {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
};
