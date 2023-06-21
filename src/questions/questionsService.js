const { AUTHOR_DETAILS } = require('../../constant');
const { Question } = require('../../model');
const { apiFeatures } = require('../common');

const getQuestions = async ({ query }) => {
  const questionsQuery = Question.find({}).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  const questions = await new apiFeatures(questionsQuery, query).paginate();
  return questions;
};

const getQuestion = async (questionId) => {
  const question = await Question.findById(questionId).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return question;
};

const createQuestion = async (question) => {
  const newQuestion = await Question.create(question);
  await newQuestion.populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  return newQuestion;
};

const updateQuestion = async ({ questionId, question }) => {
  const updatedQuestion = await Question.findByIdAndUpdate(
    questionId,
    question,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return updatedQuestion;
};

const deleteQuestion = async (questionId) => {
  const question = await Question.findByIdAndDelete(questionId).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return question;
};

const isQuestionAuthor = async ({ userId, questionId }) => {
  const { author } = await Question.findById(questionId);
  return userId.toString() === author.toString();
};

const upvoteQuestion = async ({ userId, questionId }) => {
  const question = await Question.findById(questionId).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  if (!question) {
    return false;
  }

  if (question.upvotedBy.includes(userId)) {
    question.upvotes--;
    const searchIndex = question.upvotedBy.indexOf(userId);
    question.upvotedBy.splice(searchIndex, 1);

    await question.save();

    return question;
  }

  if (question.downvotedBy.includes(userId)) {
    question.downvotes--;
    const searchIndex = question.downvotedBy.indexOf(userId);
    question.downvotedBy.splice(searchIndex, 1);
  }

  question.upvotes++;
  question.upvotedBy.push(userId);
  await question.save();

  return question;
};

const downvoteQuestion = async ({ userId, questionId }) => {
  const question = await Question.findById(questionId).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  if (!question) {
    return false;
  }

  if (question.downvotedBy.includes(userId)) {
    question.downvotes--;
    const searchIndex = question.downvotedBy.indexOf(userId);
    question.downvotedBy.splice(searchIndex, 1);

    await question.save();

    return question;
  }

  if (question.upvotedBy.includes(userId)) {
    question.upvotes--;
    const searchIndex = question.upvotedBy.indexOf(userId);
    question.upvotedBy.splice(searchIndex, 1);
  }

  question.downvotes++;
  question.downvotedBy.push(userId);
  await question.save();

  return question;
};

module.exports = {
  createQuestion,
  updateQuestion,
  isQuestionAuthor,
  getQuestions,
  getQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
};
