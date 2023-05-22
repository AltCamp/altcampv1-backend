const { omit } = require('lodash');
const { ACCOUNT_TYPES, RESPONSE_MESSAGE } = require('../../constant');
const Account = require('../../model/account');
const Mentor = require('../../model/mentor');
const Student = require('../../model/student');
const { ConflictError, UnAuthorizedError } = require('../../utils/customError');
const {
  createToken,
  validateCredentials,
  verifyPassword,
} = require('../../utils/helper');

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
    throw new ConflictError(RESPONSE_MESSAGE.CONFLICT('Mentor'));
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
  await account.populate('owner');
  const token = createToken({
    id: account.id,
    firstname,
    lastname,
  });
  res
    .status(201)
    .cookie('jwt_token', token)
    .json({
      statusCode: 201,
      message: RESPONSE_MESSAGE.CREATE_SUCCESSFUL('Mentor'),
      data: {
        token,
        user: omit(account.toObject(), ['password']),
      },
    });
};

const registerStudent = async (req, res) => {
  const { firstname, lastname, email, password, track, matric, stack, gender } =
    req.body;
  const studentExist = await Account.findOne({ email });
  if (studentExist) {
    throw new ConflictError(RESPONSE_MESSAGE.CONFLICT('Student'));
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
  await account.populate('owner');
  const token = createToken({
    id: account.id,
    firstname,
    lastname,
  });
  res
    .status(201)
    .cookie('jwt_token', token)
    .json({
      statusCode: 201,
      message: RESPONSE_MESSAGE.CREATE_SUCCESSFUL('Student'),
      data: {
        token,
        user: omit(account.toObject(), ['password']),
      },
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

  const user = omit(account.toObject(), 'password', '__v');
  res
    .status(200)
    .cookie('jwt_token', accessToken)
    .json({
      statusCode: 200,
      message: RESPONSE_MESSAGE.SUCCESS,
      data: {
        token: accessToken,
        user,
      },
    });
  console.log(req.user);
};

const logout = async (req, res) => {
  if (req.user) {
    req.logout();
  }
  res.clearCookie('jwt_token');
  res.status(200).json({
    statusCode: 200,
    message: RESPONSE_MESSAGE.LOGOUT,
  });
};

const updatePassword = async (req, res) => {
  const user = await Account.findOne(req.user._id).select('+password');
  if (!(await verifyPassword(req.body.currentPassword, user.password))) {
    throw new UnAuthorizedError('Invalid credentials!');
  }
  user.password = req.body.newPassword;
  await user.save({ validateBeforeSave: false });
  const accessToken = createToken({
    id: user._id,
  });
  res
    .status(200)
    .cookie('jwt_token', accessToken)
    .json({
      statusCode: 200,
      message: RESPONSE_MESSAGE.SUCCESS,
      data: {
        token: accessToken,
      },
    });
};

module.exports = {
  registerMentor,
  registerStudent,
  userLogin,
  logout,
  updatePassword,
};
