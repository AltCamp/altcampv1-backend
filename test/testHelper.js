const Account = require('../model/account');
const Student = require('../model/student');
const Mentor = require('../model/mentor');
const Question = require('../model/question');
const Answer = require('../model/answer');
const Post = require('../model/post');
const Comment = require('../model/comment');
const Bookmark = require('../model/bookmark');
const {
  createUserForReq,
  createBookmark,
  generateQuestion,
  generateAnswer,
  generateComment,
  generatePost,
} = require('./testUtils');

const studentsInDb = async () => {
  const students = await Student.find({});
  return students.map((student) => student.toJSON());
};

const mentorsInDb = async () => {
  const mentors = await Mentor.find({});
  return mentors.map((mentor) => mentor.toJSON());
};

const accountsInDb = async () => {
  const accounts = await Account.find({});
  return accounts.map((account) => account.toJSON());
};

const questionsInDb = async () => {
  const questions = await Question.find({});
  return questions.map((question) => question.toJSON());
};

const answersInDb = async () => {
  const answers = await Answer.find({});
  return answers.map((answer) => answer.toJSON());
};

const postsInDb = async () => {
  const posts = await Post.find({});
  return posts.map((post) => post.toJSON());
};

const commentsInDb = async () => {
  const comments = await Comment.find({});
  return comments.map((comment) => comment.toJSON());
};

const bookmarksInDb = async () => {
  const bookmarks = await Bookmark.find({});
  return bookmarks.map((bookmark) => bookmark.toJSON());
};

const generateFreshStudentData = () => {
  return createUserForReq('student');
};

const generateFreshMentorData = () => {
  return createUserForReq('mentor');
};

const accounts = require('./fixtures/accounts.json');
const students = require('./fixtures/students.json');
const mentors = require('./fixtures/mentors.json');
const questions = require('./fixtures/questions.json');
const answers = require('./fixtures/answers.json');
const posts = require('./fixtures/posts.json');
const comments = require('./fixtures/comments.json');
const bookmarks = require('./fixtures/bookmarks.json');

module.exports = {
  studentsInDb,
  mentorsInDb,
  accountsInDb,
  questionsInDb,
  answersInDb,
  postsInDb,
  commentsInDb,
  bookmarksInDb,
  generateFreshStudentData,
  generateFreshMentorData,
  generateQuestion,
  generateAnswer,
  generateComment,
  generatePost,
  createBookmark,
  accounts: accounts.map((account) => Account.create(account)),
  students: students.map((student) => Student.create(student)),
  mentors: mentors.map((mentor) => Mentor.create(mentor)),
  questions: questions.map((question) => Question.create(question)),
  answers: answers.map((answer) => Answer.create(answer)),
  posts: posts.map((post) => Post.create(post)),
  comments: comments.map((comment) => Comment.create(comment)),
  bookmarks: bookmarks.map((bookmark) => Bookmark.create(bookmark)),
  accountsAsJson: accounts,
  studentsAsJson: students,
  mentorsAsJson: mentors,
  questionsAsJson: questions,
  answersAsJson: answers,
  postsAsJson: posts,
  commentsAsJson: comments,
  bookmarksAsJson: bookmarks,
};
