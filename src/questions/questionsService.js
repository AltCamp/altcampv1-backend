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

const getQuestion = async (questionId) => {
  const question = await Question.findById(questionId);

  return question;
};

const createQuestion = async (question) => {
  const newQuestion = await Question.create(question);
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
  const question = await Question.findById(questionId);
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
  const question = await Question.findById(questionId);
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
