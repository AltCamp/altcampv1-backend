const { RESPONSE_MESSAGE } = require('../../constant');
const responseHandler = require('../../utils/responseHandler');
const accountsService = require('./accountsService');
const { NotFoundError } = require('../../utils/customError');

async function uploadProfilePicture(req, res, next) {
  try {
    const payload = req.body;

    const account = await accountsService.uploadProfilePicture({
      id: req.user.id,
      image: payload.profilePicture,
    });

    if (account instanceof Error) {
      return next(account);
    }

    new responseHandler(res, account, 200, RESPONSE_MESSAGE.SUCCESS);
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(req, res, next) {
  const { password } = req.body;
  const deletedAccount = await accountsService.deleteAccount({
    id: req.user.id,
    password,
  });

  if (deletedAccount instanceof Error) {
    next(deletedAccount);
    return;
  }

  new responseHandler(res, deletedAccount, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function getAccounts(req, res) {
  const filters = { ...req.query };
  const accounts = await accountsService.getAccounts(filters);

  new responseHandler(res, accounts, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function getAccount(req, res) {
  const { id } = req.params;
  const account = await accountsService.getSingleAccount(id);

  if (!account) {
    throw new NotFoundError('User not found!');
  }

  new responseHandler(res, account, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function updateAccount(req, res) {
  const payload = { ...req.body };
  const account = await accountsService.updateAccount({
    id: req.user.id,
    payload,
  });
  if (!account) {
    throw new NotFoundError('User not found!');
  }
  new responseHandler(res, account, 200, RESPONSE_MESSAGE.SUCCESS);
}

module.exports = {
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
  uploadProfilePicture,
};
