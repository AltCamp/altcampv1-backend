const Answer = require('../../model/answer');
const Question = require('../../model/question');

const getAnswer = async (id) => {
  const answers = await Answer.find({ id }).populate('author');

  return answers;
};

const getAnswers = async (questionId) => {
  const answers = await Answer.find({
    question: questionId,
  }).populate('author');

  return answers;
};

const createAnswer = async (answer) => {
  const newAnswer = await Answer.create(answer);
  newAnswer.question = answer.question;

  const question = await Question.findById({ _id: answer.question });
  question.answer = question.answer.concat(newAnswer._id);

  await question.save();
  await newAnswer.save();
  await newAnswer.populate('author');

  return newAnswer;
};

const updateAnswer = async (id, { content }) => {
  const updatedAnswer = await Answer.findOneAndUpdate(
    { where: { _id: id } },
    { content },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).populate('author');

  return updatedAnswer;
};

const upvoteAnswer = async ({ id, userId }) => {
  const answer = await Answer.findById(id).populate('author');
  if (!answer) {
    return false;
  }

  // Check if user has already liked question
  if (answer.upvotedBy.includes(userId)) {
    // Remove like
    answer.upvotes--;
    const searchIndex = answer.upvotedBy.indexOf(userId);
    answer.upvotedBy.splice(searchIndex, 1);

    // Update database
    await answer.save();

    return answer;
  }

  // Update database
  answer.upvotes++;
  answer.upvotedBy.push(userId);
  await answer.save();

  return answer;
};

const downvoteAnswer = async ({ id, userId }) => {
  const answer = await Answer.findById(id).populate('author');
  if (!answer) {
    return false;
  }

  // Check if user has already downvoted question
  if (answer.downvotedBy.includes(userId)) {
    // Remove downvote
    answer.downvotes--;
    const searchIndex = answer.downvotedBy.indexOf(userId);
    answer.downvotedBy.splice(searchIndex, 1);

    // update database
    await answer.save();

    return answer;
  }

  // update database
  answer.downvotes++;
  answer.downvotedBy.push(userId);
  await answer.save();

  return answer;
};

const isAnswerAuthor = async ({ userId, answerId }) => {
  const { author } = await Answer.findById(answerId);
  return userId.toString() === author.toString();
};

module.exports = {
  getAnswer,
  getAnswers,
  createAnswer,
  updateAnswer,
  upvoteAnswer,
  downvoteAnswer,
  isAnswerAuthor,
};
