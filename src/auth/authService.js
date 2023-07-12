const { omit } = require('lodash');
const accountsService = require('../accounts/accountsService');
const { createToken, validateCredentials } = require('../../utils/helper');
const { TOKEN_TYPE } = require('../../constant');
const TokenService = require('../token/tokenService');
const { BadRequestError } = require('../../utils/customError');

const registerAccount = async (payload) => {
  let account = await accountsService.accountExists(payload.email);

  if (account) {
    return false;
  }

  account = await accountsService.createAccount(payload);
  account = omit(account.toObject(), 'password');

  const token = createToken({
    id: account._id,
  });

  return { token, user: account };
};

const userLogin = async ({ email, password }) => {
  let account = await validateCredentials(email, password);
  if (!account) {
    return account;
  }

  const accessToken = createToken({
    id: account.id,
  });
  const user = omit(account.toObject(), 'password', '__v');

  return {
    token: accessToken,
    user,
  };
};

const verifyEmail = async ({ requestId, token }) => {
  const key = TOKEN_TYPE.EMAIL_VERIFICATION + requestId;
  const verificationToken = await TokenService.getToken(key);
  if (!verificationToken) throw new BadRequestError('Invalid token');

  const user = await accountsService.getSingleAccount(verificationToken.owner);
  if (!user || !(verificationToken.token === token))
    throw new BadRequestError('Invalid token');

  user.emailIsVerified = true;
  await user.save();
  TokenService.deleteToken(key);
};

module.exports = {
  registerAccount,
  userLogin,
  verifyEmail,
};
