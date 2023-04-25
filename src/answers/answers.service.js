const Answer = require('../../model/answer');
const Question = require('../../model/question');

const createAnswer = async (questionId, answer) => {
  // Create a new answer
  const newAnswer = await Answer.create(answer);

  // Update question with answer
  const question = await Question.findById({ _id: questionId });
  question.answer = question.answer.concat(newAnswer._id);
  question.save();

  return newAnswer;
};

module.exports = { createAnswer };
