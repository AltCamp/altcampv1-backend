const Question = require('../../model/question');

const getQuestions = async () => {
  const questions = await Question.find({}).populate('author', {
    firstName: 1,
    lastName: 1,
    profilePicture: 1,
  });

  return questions;
};

const getQuestion = async (questionId) => {
  const question = await Question.findById(questionId).populate('author', {
    firstName: 1,
    lastName: 1,
    profilePicture: 1,
  });

  return question;
};

const createQuestion = async (question) => {
  const newQuestion = await Question.create(question);
  await newQuestion.populate('author', {
    firstName: 1,
    lastName: 1,
    profilePicture: 1,
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
  ).populate('author', {
    firstName: 1,
    lastName: 1,
    profilePicture: 1,
  });

  return updatedQuestion;
};

const deleteQuestion = async (questionId) => {
  const question = await Question.findByIdAndDelete(questionId).populate(
    'author',
    {
      firstName: 1,
      lastName: 1,
      profilePicture: 1,
    }
  );

  return question;
};

const isQuestionAuthor = async ({ userId, questionId }) => {
  const { author } = await Question.findById(questionId);
  return userId.toString() === author.toString();
};

const upvoteQuestion = async ({ userId, questionId }) => {
  const question = await Question.findById(questionId).populate('author', {
    firstName: 1,
    lastName: 1,
    profilePicture: 1,
  });
  if (!question) {
    return false;
  }

  // Check if user has already liked question
  if (question.upvotedBy.includes(userId)) {
    // Remove like
    question.upvotes--;
    const searchIndex = question.upvotedBy.indexOf(userId);
    question.upvotedBy.splice(searchIndex, 1);

    // Update database
    await question.save();

    return question;
  }

  // Check if user has already disliked question
  if (question.downvotedBy.includes(userId)) {
    // Remove dislike
    question.downvotes--;
    const searchIndex = question.downvotedBy.indexOf(userId);
    question.downvotedBy.splice(searchIndex, 1);
  }

  // Update database
  question.upvotes++;
  question.upvotedBy.push(userId);
  await question.save();

  return question;
};

const downvoteQuestion = async ({ userId, questionId }) => {
  const question = await Question.findById(questionId).populate('author', {
    firstName: 1,
    lastName: 1,
    profilePicture: 1,
  });
  if (!question) {
    return false;
  }

  // Check if user has already downvoted question
  if (question.downvotedBy.includes(userId)) {
    // Remove downvote
    question.downvotes--;
    const searchIndex = question.downvotedBy.indexOf(userId);
    question.downvotedBy.splice(searchIndex, 1);

    // Update database
    await question.save();

    return question;
  }

  // Check if user has already liked question
  if (question.upvotedBy.includes(userId)) {
    // Remove like
    question.upvotes--;
    const searchIndex = question.upvotedBy.indexOf(userId);
    question.upvotedBy.splice(searchIndex, 1);
  }

  // Update database
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
