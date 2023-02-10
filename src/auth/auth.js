const { omit } = require('lodash');
const { ACCOUNT_TYPES } = require('../../constant');
const Account = require('../../model/account');
const Mentor = require('../../model/mentor');
const Student = require('../../model/student');
const { ConflictError, UnAuthorizedError } = require('../../utils/customError');
const { createToken, validateCredentials } = require('../../utils/helper');

const registerMentor = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    track,
    specialization,
    yearsOfExperience,
  } = req.body;
  const mentorExist = await Account.findOne({ email });
  if (mentorExist) {
    throw new ConflictError('Mentor already exists!');
  }
  const mentor = await Mentor.create({ specialization, yearsOfExperience });
  let account = await Account.create({
    firstname,
    lastname,
    email,
    password,
    track,
    owner: mentor.id,
    accountType: ACCOUNT_TYPES.MENTOR,
  });
  account = omit(account.toObject(), ['password']);
  const token = createToken(account);
  res.status(201).json({
    msg: 'Mentor created successfully',
    account,
    mentor,
    token,
  });
};

const registerStudent = async (req, res) => {
  const { firstname, lastname, email, password, track, matric, stack, gender } =
    req.body;
  // throw new Error('okay')
  const studentExist = await Account.findOne({ email });
  if (studentExist) {
    throw new ConflictError('Student Exist already!');
  }
  const student = await Student.create({ matric, stack, gender });
  let account = await Account.create({
    firstname,
    lastname,
    email,
    password,
    track,
    owner: student.id,
  });
  account = omit(account.toObject(), ['password']);
  const token = createToken(account);
  res.status(201).json({
    msg: 'Student created successfully',
    account,
    student,
    token,
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  let account = await validateCredentials(email, password);
  if (!account) {
    throw new UnAuthorizedError('Invalid credentials!');
  }
  account = omit(account.toObject(), ['password']);
  const accessToken = createToken(account);

  res.status(200).json({
    msg: 'Login successful!',
    accessToken,
  });
};

module.exports = {
  registerMentor,
  registerStudent,
  userLogin,
};
