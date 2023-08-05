const { Question } = require('../../model');
const { addIsBookmarkedField } = require('../bookmarks/bookmarksService');
const { apiFeatures } = require('../common');

const getQuestions = async ({ query } = {}, { userId }) => {
  const questionsQuery = Question.find({});
  const questions = await new apiFeatures(questionsQuery, query)
    .filter()
    .sort()
    .paginate();

  if (!userId) {
    questions.data = questions.data.map((post) => {
      return { ...post.toJSON(), isBookmarked: false };
    });
    return questions;
  }
  questions.data = await addIsBookmarkedField(questions.data, userId);
  return questions;
};

const getQuestion = async (questionId, { userId }) => {
  let question = await Question.findById(questionId);

  if (!userId) {
    question = { ...question.toJSON(), isBookmarked: false };
    return question;
  }

  question = await addIsBookmarkedField(question, userId);
  return question;
};

const createQuestion = async (question) => {
  const newQuestion = await Question.create(question);
  return newQuestion;
};

const updateQuestion = async ({ questionId, question }) => {
  let updatedQuestion = await Question.findByIdAndUpdate(questionId, question, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  updatedQuestion = await addIsBookmarkedField(
    updatedQuestion,
    updatedQuestion?.author?._id
  );
  return updatedQuestion;
};

const deleteQuestion = async (questionId) => {
  const question = await Question.findByIdAndDelete(questionId);
  return question;
};

const isQuestionAuthor = async ({ userId, questionId }) => {
  const { author } = await Question.findById(questionId);
  return userId.toString() === author._id.toString();
};

const upvoteQuestion = async ({ userId, questionId }) => {
  let question = await Question.findById(questionId);
  if (!question) {
    return false;
  }

  if (question.upvotedBy.includes(userId)) {
    const searchIndex = question.upvotedBy.indexOf(userId);
    question.upvotedBy.splice(searchIndex, 1);
  } else {
    question.upvotedBy.push(userId);
  }
  question.upvotes = question.upvotedBy.length;

  if (question.downvotedBy.includes(userId)) {
    const searchIndex = question.downvotedBy.indexOf(userId);
    question.downvotedBy.splice(searchIndex, 1);
    question.downvotes = question.downvotedBy.length;
  }

  await question.save();
  question = await addIsBookmarkedField(question, userId);

  return question;
};

const downvoteQuestion = async ({ userId, questionId }) => {
  let question = await Question.findById(questionId);
  if (!question) {
    return false;
  }

  if (question.downvotedBy.includes(userId)) {
    const searchIndex = question.downvotedBy.indexOf(userId);
    question.downvotedBy.splice(searchIndex, 1);
    question.downvotes = question.downvotedBy.length;
  } else {
    question.downvotedBy.push(userId);
    question.downvotes = question.downvotedBy.length;
  }

  if (question.upvotedBy.includes(userId)) {
    const searchIndex = question.upvotedBy.indexOf(userId);
    question.upvotedBy.splice(searchIndex, 1);
    question.upvotes = question.upvotedBy.length;
  }

  await question.save();
  question = await addIsBookmarkedField(question, userId);

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
