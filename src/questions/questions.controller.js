const questionService = require('./questions.service');
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const getQuestion = async (req, res) => {
  // grab questionID from request
  const questionId = req.params.id;

  const question = await questionService.getQuestion(questionId);

  if (!question) throw new NotFoundError('Not Found');

  new responseHandler(res, question, 200, RESPONSE_MESSAGE.SUCCESS);
};

const getAllQuestions = async (req, res) => {
  const questions = await questionService.getQuestions();
  new responseHandler(res, questions, 200, RESPONSE_MESSAGE.SUCCESS);
};

const createQuestion = async (req, res) => {
  // grab request data
  const question = { ...req.body };

  // create question
  const newQuestion = await questionService.createQuestion({
    ...question,
    author: req.user._id,
  });

  // send response to client
  new responseHandler(res, newQuestion, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updateQuestion = async (req, res) => {
  // grab questionID from request
  const questionId = req.params.id;

  // check if user is question author
  const isAuthor = await questionService.isQuestionAuthor({
    userId: req.user._id,
    questionId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  // grab request data
  const question = { ...req.body };

  // update question
  const updatedQuestion = await questionService.updateQuestion({
    questionId,
    question,
  });

  if (!updatedQuestion) throw new NotFoundError('Not Found');

  // send response to client
  new responseHandler(res, updatedQuestion, 200, RESPONSE_MESSAGE.SUCCESS);
};

const deleteQuestion = async (req, res) => {
  // grab questionID from request
  const questionId = req.params.id;

  // check if user is question author
  const isAuthor = await questionService.isQuestionAuthor({
    userId: req.user._id,
    questionId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const deleted = await questionService.deleteQuestion(questionId);

  if (!deleted) throw new NotFoundError('Not Found');

  new responseHandler(res, deleted, 200, RESPONSE_MESSAGE.SUCCESS);
};

const upvoteQuestion = async (req, res) => {
  // grab questionID from request
  const questionId = req.params.id;

  // upvote the question
  const upvote = await questionService.upvoteQuestion({
    userId: req.user._id,
    questionId,
  });

  if (!upvote) throw new BadRequestError('Unable to upvote question');

  // send response to client
  new responseHandler(res, upvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

const downvoteQuestion = async (req, res) => {
  // grab questionID from request
  const questionId = req.params.id;

  // upvote the question
  const downvote = await questionService.downvoteQuestion({
    userId: req.user._id,
    questionId,
  });

  if (!downvote) throw new BadRequestError('Unable to upvote question');

  // send response to client
  new responseHandler(res, downvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  createQuestion,
  updateQuestion,
  getAllQuestions,
  getQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
};
