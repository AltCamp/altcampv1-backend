const { omit } = require('lodash');
const accountsService = require('../accounts/accountsService');
const { createToken, validateCredentials } = require('../../utils/helper');

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

module.exports = {
  registerAccount,
  userLogin,
};
