const questionService = require('./questions.service');
const { NotFoundError, UnAuthorizedError } = require('../../utils/customError');

const getQuestion = async (req, res) => {
  // grab questionID from request
  const questionId = req.params.id;

  const question = await questionService.getQuestion(questionId);

  if (!question) throw new NotFoundError('Not Found');

  return res.status(200).json({ status: 'success', data: question });
};

const getAllQuestions = async (req, res) => {
  const questions = await questionService.getQuestions();
  return res.status(200).json({ data: questions });
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
  return res.status(201).json({ status: 'success', data: newQuestion });
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
  return res.status(200).json({ status: 'success', data: updatedQuestion });
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

  return res.status(200).json({ status: 'success', data: deleted });
};

module.exports = {
  createQuestion,
  updateQuestion,
  getAllQuestions,
  getQuestion,
  deleteQuestion,
};
