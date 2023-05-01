const Answer = require('../../model/answer');
const Question = require('../../model/question');

const createAnswer = async (questionId, answer) => {
  const newAnswer = await Answer.create(answer);

  const question = await Question.findById({ _id: questionId });
  question.answer = question.answer.concat(newAnswer._id);
  question.save();

  return newAnswer;
};

const updateAnswer = async (questionId, { answerId, answer }) => {
  const updatedAnswer = await Answer.findOneAndUpdate(
    { where: { _id: answerId, question: questionId } },
    answer,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  return updatedAnswer;
};

const isAnswerAuthor = async ({ userId, answerId }) => {
  const { author } = await Answer.findById(answerId);
  return userId.toString() === author.toString();
};

module.exports = { createAnswer, updateAnswer, isAnswerAuthor };
