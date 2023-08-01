const { Answer, Question } = require('../../model');
const { addIsBookmarkedField } = require('../bookmarks/bookmarksService');

const getAnswer = async (id) => {
  const answers = await Answer.find({ id });

  return answers;
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
  const updatedAnswer = await Answer.findByIdAndUpdate(
    id,
    { content },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  return updatedAnswer;
};

const upvoteAnswer = async ({ id, userId }) => {
  const answer = await Answer.findById(id);
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
  const answer = await Answer.findById(id);
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
