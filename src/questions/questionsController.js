const questionsService = require('./questionsService');
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');
const TagsService = require('../tags/tagsService');
const tagsService = new TagsService();

const getQuestion = async (req, res) => {
  const questionId = req.params.id;

  const question = await questionsService.getQuestion(questionId);

  if (!question) throw new NotFoundError('Not Found');

  new responseHandler(res, question, 200, RESPONSE_MESSAGE.SUCCESS);
};

const getAllQuestions = async (req, res) => {
  const { data, meta } = await questionsService.getQuestions(req);
  new responseHandler(res, data, 200, RESPONSE_MESSAGE.SUCCESS, meta);
};

const createQuestion = async (req, res) => {
  let { tags, ...question } = { ...req.body };

  if (tags) {
    const tagsInDb = await tagsService.createTags(tags);
    tags = tagsInDb.map(({ _id }) => _id);
  }

  const newQuestion = await questionsService.createQuestion({
    ...question,
    tags,
    author: req.user._id,
  });

  new responseHandler(res, newQuestion, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updateQuestion = async (req, res) => {
  const questionId = req.params.id;

  const isAuthor = await questionsService.isQuestionAuthor({
    userId: req.user._id,
    questionId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  let { tags, ...question } = { ...req.body };
  if (tags) {
    const tagsInDb = await tagsService.createTags(tags);
    tags = tagsInDb.map(({ _id }) => _id);
  }

  const updatedQuestion = await questionsService.updateQuestion({
    questionId,
    question: { ...question, tags },
  });

  if (!updatedQuestion) throw new NotFoundError('Not Found');

  new responseHandler(res, updatedQuestion, 200, RESPONSE_MESSAGE.SUCCESS);
};

const deleteQuestion = async (req, res) => {
  const questionId = req.params.id;

  const isAuthor = await questionsService.isQuestionAuthor({
    userId: req.user._id,
    questionId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const deleted = await questionsService.deleteQuestion(questionId);

  if (!deleted) throw new NotFoundError('Not Found');

  new responseHandler(res, deleted, 200, RESPONSE_MESSAGE.SUCCESS);
};

const upvoteQuestion = async (req, res) => {
  const questionId = req.params.id;

  const upvote = await questionsService.upvoteQuestion({
    userId: req.user._id,
    questionId,
  });

  if (!upvote) throw new BadRequestError('Unable to upvote question');

  new responseHandler(res, upvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

const downvoteQuestion = async (req, res) => {
  const questionId = req.params.id;

  const downvote = await questionsService.downvoteQuestion({
    userId: req.user._id,
    questionId,
  });

  if (!downvote) throw new BadRequestError('Unable to downvote question');

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
