const answerService = require('./answersService');
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const getAnswer = async (req, res) => {
  const { id } = req.params;

  const answers = await answerService.getAnswer(id);

  new responseHandler(res, answers, 200, RESPONSE_MESSAGE.SUCCESS);
};

const getAnswers = async (req, res) => {
  const { questionId } = req.query;
  const userId = req.user?._id;

  const answers = await answerService.getAnswers(questionId, userId);

  new responseHandler(res, answers, 200, RESPONSE_MESSAGE.SUCCESS);
};

const createAnswer = async (req, res) => {
  const { content, questionId } = req.body;

  const answer = await answerService.createAnswer({
    content,
    question: questionId,
    author: req.user._id,
  });

  new responseHandler(res, answer, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updateAnswer = async (req, res) => {
  const { id } = req.params;

  const isAuthor = await answerService.isAnswerAuthor({
    userId: req.user._id,
    answerId: id,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const { content } = req.body;
  const updatedAnswer = await answerService.updateAnswer(id, { content });
  if (!updatedAnswer) throw new NotFoundError('Not Found');

  new responseHandler(res, updatedAnswer, 200, RESPONSE_MESSAGE.SUCCESS);
};

const upvoteAnswer = async (req, res) => {
  const { id } = req.params;

  const upvote = await answerService.upvoteAnswer({
    id,
    userId: req.user._id,
  });

  if (!upvote) throw new BadRequestError('Unable to upvote answer');

  new responseHandler(res, upvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

const downvoteAnswer = async (req, res) => {
  const { id } = req.params;

  const downvote = await answerService.downvoteAnswer({
    id,
    userId: req.user._id,
  });

  if (!downvote) throw new BadRequestError('Unable to downvote answer');

  new responseHandler(res, downvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  getAnswer,
  getAnswers,
  createAnswer,
  updateAnswer,
  upvoteAnswer,
  downvoteAnswer,
};
