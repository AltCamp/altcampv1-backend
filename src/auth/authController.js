const { RESPONSE_MESSAGE, TOKEN_TYPE } = require('../../constant');
const {
  ConflictError,
  UnAuthorizedError,
  BadRequestError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const authService = require('./authService');
const TokenService = require('../token.service');
const { Account } = require('../../model');
const { sendVerificationMail } = require('../../utils/sendMails');

const registerAccount = async (req, res) => {
  const payload = { ...req.body };
  let registrationData = await authService.registerAccount(payload);

  if (!registrationData) {
    throw new ConflictError(RESPONSE_MESSAGE.CONFLICT(payload.category));
  }
  const { token, user } = registrationData;

  res.cookie('jwt_token', token);
  new responseHandler(
    res,
    { token, user },
    201,
    RESPONSE_MESSAGE.CREATE_SUCCESSFUL(payload.category)
  );
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  let loginData = await authService.userLogin({ email, password });
  if (!loginData) {
    throw new UnAuthorizedError('Invalid credentials!');
  }
  const { token, user } = loginData;

  res.cookie('jwt_token', token);
  new responseHandler(res, { token, user }, 200, RESPONSE_MESSAGE.SUCCESS);
};

const userLogout = async (req, res) => {
  if (req.user) {
    req.logout();
  }
  res.clearCookie('jwt_token');
  new responseHandler(res, undefined, 200, RESPONSE_MESSAGE.LOGOUT);
};

const sendEmailVerification = async (req, res) => {
  if (req.user.emailIsVerified)
    throw new BadRequestError('Email is already verified');
  await sendVerificationMail(req.user);
  new responseHandler(
    res,
    undefined,
    200,
    'Please check your registered email for the 4 digit OTP'
  );
};

const verifyEmailOtp = async (req, res) => {
  const otp = req.body.token;
  const user = await Account.findById(req.user.id);
  if (!user) throw new BadRequestError('User does not exist!');
  const token = await TokenService.getToken({
    type: TOKEN_TYPE.EMAIL_VERIFICATION,
    owner: user.id,
    token: otp,
  });

  if (!token) throw new BadRequestError('OTP not found!');

  if (!token.token === otp) throw new BadRequestError('Incorrect OTP!');

  if (token.expiryTime <= Date.now())
    throw new BadRequestError('Expired Token');

  user.emailIsVerified = true;

  await user.save();
  await token.delete();
  new responseHandler(res, undefined, 200, 'Email verification successful!');
};

module.exports = {
  registerAccount,
  userLogin,
  userLogout,
  verifyEmailOtp,
  sendEmailVerification,
};
