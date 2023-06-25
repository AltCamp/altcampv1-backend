const { RESPONSE_MESSAGE } = require('../../constant');
const responseHandler = require('../../utils/responseHandler');
const accountsService = require('./accountsService');
const { NotFoundError, BadRequestError } = require('../../utils/customError');

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

async function deleteProfilePicture(req, res, next) {
  try {
    const account = await accountsService.deleteProfilePicture(req.user.id);

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
  const { data, meta } = await accountsService.getAccounts(req);

  new responseHandler(res, data, 200, RESPONSE_MESSAGE.SUCCESS, meta);
}

async function updatePassword(req, res) {
  const token = await accountsService.updatePassword(
    req.user._id,
    req.body.oldPassword,
    req.body.password
  );

  new responseHandler(res, token, 200, RESPONSE_MESSAGE.SUCCESS);
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const verifyUserAndSendOtp = await accountsService.forgotPassword({ email });

  if (!verifyUserAndSendOtp) throw new BadRequestError();

  new responseHandler(res, undefined, 200, RESPONSE_MESSAGE.SUCCESS);
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const reset = await accountsService.resetPassword({ token, newPassword });

  new responseHandler(res, reset, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
  uploadProfilePicture,
  deleteProfilePicture,
  updatePassword,
  forgotPassword,
  resetPassword,
};
