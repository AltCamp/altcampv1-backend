const Account = require('../model/account');
const Student = require('../model/student');
const Mentor = require('../model/mentor');
const Question = require('../model/question');
const { createUserForReq, generateQuestion } = require('./testUtils');

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

module.exports = {
  studentsInDb,
  mentorsInDb,
  accountsInDb,
  questionsInDb,
  generateFreshStudentData,
  generateFreshMentorData,
  generateQuestion,
  accounts: accounts.map((account) => Account.create(account)),
  students: students.map((student) => Student.create(student)),
  mentors: mentors.map((mentor) => Mentor.create(mentor)),
  questions: questions.map((question) => Question.create(question)),
  accountsAsJson: accounts,
  studentsAsJson: students,
  mentorsAsJson: mentors,
  questionsAsJson: questions,
};
