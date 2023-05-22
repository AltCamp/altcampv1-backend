const { omit } = require('lodash');
const { RESPONSE_MESSAGE } = require('../../constant');
const { ConflictError, UnAuthorizedError } = require('../../utils/customError');
const { createToken, validateCredentials } = require('../../utils/helper');
const accountsService = require('../accounts/accountsService');
const responseHandler = require('../../utils/responseHandler');

const registerAccount = async (req, res) => {
  const payload = { ...req.body };
  let account = await accountsService.accountExists(payload.email);

  if (account) {
    throw new ConflictError(RESPONSE_MESSAGE.CONFLICT(payload.category));
  }

  account = await accountsService.createAccount(payload);
  account = omit(account.toObject(), 'password');

  const token = createToken({
    id: account._id,
  });

  new responseHandler(
    res,
    { token, user: account },
    201,
    RESPONSE_MESSAGE.CREATE_SUCCESSFUL(payload.category)
  );
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  let account = await validateCredentials(email, password);
  if (!account) {
    throw new UnAuthorizedError('Invalid credentials!');
  }
  const token = createToken({
    id: account._id,
  });

  const user = omit(account.toObject(), 'password', '__v');
  new responseHandler(res, { token, user }, 200, RESPONSE_MESSAGE.SUCCESS);
};

const userLogout = async (req, res) => {
  if (req.user) {
    req.logout();
  }
  res.clearCookie('jwt_token');
  res.status(200).json({
    statusCode: 200,
    message: RESPONSE_MESSAGE.LOGOUT,
  });
};

module.exports = {
  registerAccount,
  userLogin,
  userLogout,
};
