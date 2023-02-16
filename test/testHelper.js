const Account = require('../model/account');
const Student = require('../model/student');
const Mentor = require('../model/mentor');
const { createUserForReq } = require('./testUtils');

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

const generateFreshStudentData = () => {
  return createUserForReq('student');
};

const generateFreshMentorData = () => {
  return createUserForReq('mentor');
};

const accounts = require('./fixtures/accounts.json');
const students = require('./fixtures/students.json');
const mentors = require('./fixtures/mentors.json');

module.exports = {
  studentsInDb,
  mentorsInDb,
  accountsInDb,
  generateFreshStudentData,
  generateFreshMentorData,
  accounts: accounts.map((account) => Account.create(account)),
  students: students.map((student) => Student.create(student)),
  mentors: mentors.map((mentor) => Mentor.create(mentor)),
};
