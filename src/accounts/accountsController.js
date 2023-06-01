const { RESPONSE_MESSAGE } = require('../../constant');
const responseHandler = require('../../utils/responseHandler');
const accountsService = require('./accountsService');
const { validateImageInput, deleteFile } = require('./helper');
const {
  NotFoundError,
  UnprocessableEntity,
} = require('../../utils/customError');

async function uploadProfilePicture(req, res, next) {
  try {
    const error = validateImageInput(req.body, req.file);

    if (error) {
      deleteFile(req.file.path);
      return next(error);
    }

    const account = await accountsService.uploadProfilePicture({
      id: req.user.id,
      filepath: req.file.path,
    });

    if (account instanceof Error) {
      deleteFile(req.file.path);
      return next(account);
    }

    new responseHandler(res, account, 200, RESPONSE_MESSAGE.SUCCESS);
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    return next(error);
  }
}

async function getAccounts(req, res) {
  const filters = { ...req.query };
  const accounts = await accountsService.getAccounts(filters);

  new responseHandler(res, accounts, 200, RESPONSE_MESSAGE.SUCCESS);
}

async function updatePassword(req, res) {
  const { token } = await accountsService.updatePassword(
    req,
    req.user._id,
    req.body.password
  );
  if (req.body.password !== req.body.retypePassword) {
    throw new UnprocessableEntity('Password and retype password must match');
  }
  res.cookie('jwt_token', token);
  new responseHandler(res, { token }, 200, RESPONSE_MESSAGE.SUCCESS);
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
  getAccount,
  getAccounts,
  updateAccount,
  uploadProfilePicture,
  updatePassword,
};
