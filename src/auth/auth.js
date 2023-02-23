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
  const token = createToken({
    id: account.id,
    firstname,
    lastname,
  });
  res
    .status(201)
    .cookie('jwt_token', token)
    .json({
      msg: 'Mentor created successfully',
      account: omit(account.toObject(), ['password']),
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
  const token = createToken({
    id: account.id,
    firstname,
    lastname,
  });
  res
    .status(201)
    .cookie('jwt_token', token)
    .json({
      msg: 'Student created successfully',
      account: omit(account.toObject(), ['password']),
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
  const accessToken = createToken({
    id: account.id,
  });

  res.status(200).cookie('jwt_token', accessToken).json({
    msg: 'Login successful!',
    accessToken,
  });
};

const logout = async (req, res) => {
  if (req.user) {
    req.logout();
  }
  res.clearCookie('jwt_token');
  res.status(200).json({
    msg: 'You have been logged out',
  });
};

module.exports = {
  registerMentor,
  registerStudent,
  userLogin,
  logout,
};
