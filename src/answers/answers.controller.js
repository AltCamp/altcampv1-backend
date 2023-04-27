const answerService = require('./answers.service');
const {
  // BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const createAnswer = async (req, res) => {
  // grap question id
  const questionId = req.params.questionId;

  // create answer object
  const answer = { ...req.body };

  // create answer
  const newAnswer = await answerService.createAnswer(questionId, {
    ...answer,
    question: questionId.toString(),
    author: req.user._id,
  });

  // send response to client
  new responseHandler(res, newAnswer, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updateAnswer = async (req, res) => {
  // grab questionID from request
  const questionId = req.params.questionId;

  // grab answerID from request
  const answerId = req.params.answerId;

  // check if user is answer author
  const isAuthor = await answerService.isAnswerAuthor({
    userId: req.user._id,
    answerId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  // grab request data
  const answer = { ...req.body };

  // update answerzqa
  const updatedAnswer = await answerService.updateAnswer(questionId, {
    answerId,
    answer,
  });

  if (!updatedAnswer) throw new NotFoundError('Not Found');

  // send response to client
  new responseHandler(res, updatedAnswer, 200, RESPONSE_MESSAGE.SUCCESS);
};

const deleteAnswer = async (req, res) => {
  return res.send('postAnswer');
};

module.exports = {
  createAnswer,
  updateAnswer,
  deleteAnswer,
};
