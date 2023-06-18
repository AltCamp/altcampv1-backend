const { AUTHOR_DETAILS } = require('../../constant');
const { Answer, Question } = require('../../model');

const getAnswer = async (id) => {
  const answers = await Answer.find({ id }).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return answers;
};

const getAnswers = async (questionId) => {
  const answers = await Answer.find({
    question: questionId,
  }).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return answers;
};

const createAnswer = async (answer) => {
  const newAnswer = await Answer.create(answer);
  newAnswer.question = answer.question;

  const question = await Question.findById({ _id: answer.question });
  question.answer = question.answer.concat(newAnswer._id);

  await question.save();
  await newAnswer.save();
  await newAnswer.populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return newAnswer;
};

const updateAnswer = async (id, { content }) => {
  const updatedAnswer = await Answer.findByIdAndUpdate(
    id,
    { content },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return updatedAnswer;
};

const upvoteAnswer = async ({ id, userId }) => {
  const answer = await Answer.findById(id).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  if (!answer) {
    return false;
  }

  if (answer.upvotedBy.includes(userId)) {
    answer.upvotes--;
    const searchIndex = answer.upvotedBy.indexOf(userId);
    answer.upvotedBy.splice(searchIndex, 1);

    await answer.save();

    return answer;
  }

  if (answer.downvotedBy.includes(userId)) {
    answer.downvotes--;
    const searchIndex = answer.downvotedBy.indexOf(userId);
    answer.downvotedBy.splice(searchIndex, 1);
  }

  answer.upvotes++;
  answer.upvotedBy.push(userId);
  await answer.save();

  return answer;
};

const downvoteAnswer = async ({ id, userId }) => {
  const answer = await Answer.findById(id).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  if (!answer) {
    return false;
  }

  if (answer.downvotedBy.includes(userId)) {
    answer.downvotes--;
    const searchIndex = answer.downvotedBy.indexOf(userId);
    answer.downvotedBy.splice(searchIndex, 1);

    await answer.save();

    return answer;
  }

  if (answer.upvotedBy.includes(userId)) {
    answer.upvotes--;
    const searchIndex = answer.upvotedBy.indexOf(userId);
    answer.upvotedBy.splice(searchIndex, 1);
  }

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
