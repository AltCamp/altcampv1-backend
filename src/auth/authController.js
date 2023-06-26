const {
  RESPONSE_MESSAGE,
  TOKEN_TYPE,
  EMAIL_TEMPLATES,
  EMAIL_SUBJECTS,
} = require('../../constant');
const {
  ConflictError,
  UnAuthorizedError,
  BadRequestError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const authService = require('./authService');
const TokenService = require('../token/tokenService');
const accountService = require('../accounts/accountsService');
const mailService = require('../mailer/mailerService');
const { getDifferenceInMinutes } = require('../../utils/helper');

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

const verifyEmail = async (req, res) => {
  if (req.user.emailIsVerified)
    throw new BadRequestError(RESPONSE_MESSAGE.ALREADY_VERIFIED);

  const otpCode = Math.floor(Math.random() * 9000) + 1000;
  const token = await TokenService.createToken({
    token: otpCode,
    type: TOKEN_TYPE.EMAIL_VERIFICATION,
    owner: req.user.id,
  });

  if (!token) throw new BadRequestError();

  const tokenValidity = getDifferenceInMinutes(token);
  const mailServicePayload = {
    context: { name: req.user.firstName, token: otpCode, tokenValidity },
    email: req.user.email,
    templateName: EMAIL_TEMPLATES.EMAIL_VERIFICATION,
    subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
  };

  await mailService.sendMail(mailServicePayload);

  new responseHandler(res, undefined, 200, RESPONSE_MESSAGE.SUCCESS);
};

const verifyEmailOtp = async (req, res) => {
  const otp = req.body.token;

  const user = await accountService.getSingleAccount(req.user.id);
  if (!user) throw new BadRequestError('User does not exist!');

  const token = await TokenService.getToken({
    type: TOKEN_TYPE.EMAIL_VERIFICATION,
    owner: user.id,
    token: otp,
  });

  if (!token) throw new BadRequestError('OTP not found!');

  if (!token.token === otp) throw new BadRequestError('Incorrect OTP!');

  if (token.expiryTime.getTime() <= Date.now()) {
    TokenService.deleteToken(token._id);
    throw new BadRequestError('Expired Token');
  }

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
  verifyEmail,
};
