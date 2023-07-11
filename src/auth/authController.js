const {
  RESPONSE_MESSAGE,
  TOKEN_TYPE,
  EMAIL_TEMPLATES,
  EMAIL_SUBJECTS,
  OTP_VALIDITY,
} = require('../../constant');
const {
  ConflictError,
  UnAuthorizedError,
  BadRequestError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const authService = require('./authService');
const TokenService = require('../token/tokenService');
const mailService = require('../mailer/mailerService');
const { tokenExpires, generateId } = require('../../utils/helper');

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

const requestEmailVerification = async (req, res) => {
  if (req.user.emailIsVerified)
    throw new BadRequestError(RESPONSE_MESSAGE.ALREADY_VERIFIED);

  const requestId = generateId();
  const token = await TokenService.createToken({
    requestId,
    type: TOKEN_TYPE.EMAIL_VERIFICATION,
    owner: req.user.id,
    timeToLive: OTP_VALIDITY.EMAIL_VERIFICATION,
  });

  if (!token) throw new BadRequestError();

  const mailServicePayload = {
    context: {
      token: token,
      name: req.user.firstName,
      tokenValidity: tokenExpires(OTP_VALIDITY.EMAIL_VERIFICATION),
    },
    email: req.user.email,
    templateName: EMAIL_TEMPLATES.EMAIL_VERIFICATION,
    subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
  };

  await mailService.sendMail(mailServicePayload);

  new responseHandler(res, { requestId }, 200, RESPONSE_MESSAGE.SUCCESS);
};

const verifyEmail = async (req, res) => {
  const payload = { ...req.body };

  await authService.verifyEmail(payload);

  new responseHandler(res, undefined, 200, 'Email verification successful!');
};

module.exports = {
  registerAccount,
  userLogin,
  userLogout,
  verifyEmail,
  requestEmailVerification,
};
