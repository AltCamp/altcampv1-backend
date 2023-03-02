const Question = require('../../model/question');

const getQuestions = async () => {
  const questions = await Question.find({}).populate('author', {
    firstname: 1,
    lastname: 1,
  });

  return questions;
};

const getQuestion = async (questionId) => {
  const question = await Question.findById(questionId).populate('author', {
    firstname: 1,
    lastname: 1,
  });

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
  return userId.toString() === author.toString();
};

module.exports = {
  createQuestion,
  updateQuestion,
  isQuestionAuthor,
  getQuestions,
  getQuestion,
  deleteQuestion,
};
