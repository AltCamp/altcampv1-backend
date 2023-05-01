const Account = require('../model/account');
const Student = require('../model/student');
const Mentor = require('../model/mentor');
const Question = require('../model/question');
const Answer = require('../model/answer');
const {
  createUserForReq,
  generateQuestion,
  generateAnswer,
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

module.exports = {
  studentsInDb,
  mentorsInDb,
  accountsInDb,
  questionsInDb,
  answersInDb,
  generateFreshStudentData,
  generateFreshMentorData,
  generateQuestion,
  generateAnswer,
  accounts: accounts.map((account) => Account.create(account)),
  students: students.map((student) => Student.create(student)),
  mentors: mentors.map((mentor) => Mentor.create(mentor)),
  questions: questions.map((question) => Question.create(question)),
  answers: answers.map((answer) => Answer.create(answer)),
  accountsAsJson: accounts,
  studentsAsJson: students,
  mentorsAsJson: mentors,
  questionsAsJson: questions,
  answersAsJson: answers,
};
