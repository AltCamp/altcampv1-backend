const answerService = require('./answers.service');
const { NotFoundError, UnAuthorizedError } = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const createAnswer = async (req, res) => {
  const { questionId } = req.params;

  const payload = { ...req.body };

  const answer = await answerService.createAnswer(questionId, {
    ...payload,
    question: questionId.toString(),
    author: req.user._id,
  });

  new responseHandler(res, answer, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updateAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;

  const isAuthor = await answerService.isAnswerAuthor({
    userId: req.user._id,
    answerId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const answer = { ...req.body };
  const updatedAnswer = await answerService.updateAnswer(questionId, {
    answerId,
    answer,
  });
  if (!updatedAnswer) throw new NotFoundError('Not Found');

  new responseHandler(res, updatedAnswer, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  createAnswer,
  updateAnswer,
};
