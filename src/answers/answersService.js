const { Answer, Question } = require('../../model');
const { addIsBookmarkedField } = require('../bookmarks/bookmarksService');

const getAnswer = async (id, { userId }) => {
  let answer = await Answer.find({ id });

  if (!userId) {
    answer = { ...answer.toJSON(), isBookmarked: false };
    return answer;
  }

  answer = await addIsBookmarkedField(answer, userId);
  return answer;
};

const getAnswers = async (questionId, userId) => {
  let answers = await Answer.find({
    question: questionId,
  });

  if (!userId) {
    answers = answers.map((answer) => {
      return { ...answer.toJSON(), isBookmarked: false };
    });
    return answers;
  }

  answers = await addIsBookmarkedField(answers, userId);
  return answers;
};

const createAnswer = async (answer) => {
  const newAnswer = await Answer.create(answer);
  newAnswer.question = answer.question;

  const question = await Question.findById({ _id: answer.question });
  question.answer = question.answer.concat(newAnswer._id);

  await question.save();
  await newAnswer.save();

  return newAnswer;
};

const updateAnswer = async (id, { content }) => {
  let updatedAnswer = await Answer.findByIdAndUpdate(
    id,
    { content },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  updatedAnswer = await addIsBookmarkedField(
    updatedAnswer,
    updatedAnswer?.author?._id
  );

  return updatedAnswer;
};

const upvoteAnswer = async ({ id, userId }) => {
  let answer = await Answer.findById(id);
  if (!answer) {
    return false;
  }

  if (answer.upvotedBy.includes(userId)) {
    const searchIndex = answer.upvotedBy.indexOf(userId);
    answer.upvotedBy.splice(searchIndex, 1);
  } else {
    answer.upvotedBy.push(userId);
  }
  answer.upvotes = answer.upvotedBy.length;

  if (answer.downvotedBy.includes(userId)) {
    const searchIndex = answer.downvotedBy.indexOf(userId);
    answer.downvotedBy.splice(searchIndex, 1);
    answer.downvotes = answer.downvotedBy.length;
  }

  await answer.save();
  answer = await addIsBookmarkedField(answer, userId);

  return answer;
};

const downvoteAnswer = async ({ id, userId }) => {
  let answer = await Answer.findById(id);
  if (!answer) {
    return false;
  }

  if (answer.downvotedBy.includes(userId)) {
    const searchIndex = answer.downvotedBy.indexOf(userId);
    answer.downvotedBy.splice(searchIndex, 1);
  } else {
    answer.downvotedBy.push(userId);
  }
  answer.downvotes = answer.downvotedBy.length;

  if (answer.upvotedBy.includes(userId)) {
    const searchIndex = answer.upvotedBy.indexOf(userId);
    answer.upvotedBy.splice(searchIndex, 1);
    answer.upvotes = answer.upvotedBy.length;
  }

  await answer.save();
  answer = await addIsBookmarkedField(answer, userId);

  return answer;
};

const isAnswerAuthor = async ({ userId, answerId }) => {
  const { author } = await Answer.findById(answerId);
  return userId.toString() === author._id.toString();
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
