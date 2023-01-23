const { omit } = require('lodash');
const { ACCOUNT_TYPES } = require('../../constant');
const Account = require('../../model/account');
const Mentor = require('../../model/mentor');
const Student = require('../../model/student');
const { ConflitError } = require('../../utils/customError');
const { createToken, validateCredentials } = require('../../utils/helper');

const registerMentor = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    track,
    specialization,
    yearsOrExperience,
  } = req.body;
  const mentorExisit = await Account.findOne({ email });
  if (mentorExisit) {
    throw new ConflitError('Mentor already exist!');
  }
  const mentor = await Mentor.create({ specialization, yearsOrExperience });
  let account = await Account.create({
    firstname,
    lastname,
    email,
    password,
    track,
    owner: mentor.id,
    accountType: ACCOUNT_TYPES.MENTORn,
  });
  account = omit(account.toObject(), ['password']);
  const token = createToken(account);
  res.status(201).json({
    msg: 'Mentor created successfully',
    account,
    ...mentor,
    token,
  });
};

const registerStudent = async (req, res) => {
  const { firstname, lastname, email, password, track, matric, stack, gender } =
    req.body;
  // throw new Error('okay')
  const studentExist = await Account.findOne({ email });
  if (studentExist) {
    return res.status(409).json({
      msg: 'Student already exist!',
    });
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
    ...student,
    token,
  });
};

const studentLogin = async (req, res) => {
  const { email, password } = req.body;

  let account = await validateCredentials(email, password);
  if (!account) {
    return res.status(401).json({
      msg: 'Invalid credentials!',
    });
  }
  account = omit(account.toObject(), ['password']);
  const acessToken = createToken(account);

  res.status(200).json({
    msg: 'Login successful!',
    acessToken,
  });
};

module.exports = {
  registerMentor,
  registerStudent,
  studentLogin,
};
