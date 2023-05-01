const answerService = require('./answers.service');
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const getAnswers = async (req, res) => {
  const { questionId } = req.params;

  const answers = await answerService.getAnswers(questionId);

  new responseHandler(res, answers, 200, RESPONSE_MESSAGE.SUCCESS);
};

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

const upvoteAnswer = async (req, res) => {
  const { answerId } = req.params;

  const upvote = await answerService.upvoteAnswer({
    userId: req.user._id,
    answerId,
  });

  if (!upvote) throw new BadRequestError('Unable to upvote answer');

  new responseHandler(res, upvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

const downvoteAnswer = async (req, res) => {
  const { answerId } = req.params;

  const downvote = await answerService.downvoteAnswer({
    userId: req.user._id,
    answerId,
  });

  if (!downvote) throw new BadRequestError('Unable to downvote answer');

  new responseHandler(res, downvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  getAnswers,
  createAnswer,
  updateAnswer,
  upvoteAnswer,
  downvoteAnswer,
};
