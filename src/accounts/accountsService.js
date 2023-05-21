const { ACCOUNT_TYPES } = require('../../constant');
const Account = require('../../model/account');
const Mentor = require('../../model/mentor');
const Student = require('../../model/student');
const Model = {
  mentor: Mentor,
  student: Student,
};
const { omit } = require('lodash');

async function accountExists(email) {
  const account = await Account.findOne({ email });

  if (account) {
    return true;
  }

  return false;
}

async function getStudents() {
  const students = await Account.find({
    accountType: ACCOUNT_TYPES.STUDENT,
  }).populate('owner');

  return students;
}

async function getMentors() {
  const mentors = await Account.find({
    accountType: ACCOUNT_TYPES.MENTOR,
  }).populate('owner');

  return mentors;
}

async function getSingleAccount(id) {
  const account = await Account.findById(id).populate('owner');

  return account;
}

async function updateAccount({ id, payload }) {
  const student = await Account.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('owner');

  return student;
}

async function changeAccountPassword({ id, password }) {
  let account = await Account.findById(id).populate('owner');
  if (!account) {
    return false;
  }

  // save password from request
  account.password = password;
  await account.save();

  // prepare response data
  omit(account.toObject(), ['password']);
  account = omit(account.toObject(), ['password']);

  return account;
}

async function createAccount({ category, altSchoolId, ...payload }) {
  const obj = (altSchoolId && { altSchoolId }) || {};
  const { _id: owner } = await Model[category.toLowerCase()].create(obj);
  const account = await Account.create({
    ...payload,
    owner,
    accountType: category,
  });
  await account.populate('owner');
  return account;
}

module.exports = {
  accountExists,
  createAccount,
  changeAccountPassword,
  getMentors,
  getSingleAccount,
  getStudents,
  updateAccount,
};
