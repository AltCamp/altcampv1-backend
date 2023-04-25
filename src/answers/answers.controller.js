const answerService = require('./answers.service');
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
  return res.send('postAnswer');
};

const deleteAnswer = async (req, res) => {
  return res.send('postAnswer');
};

module.exports = {
  createAnswer,
  updateAnswer,
  deleteAnswer,
};
