const { RESPONSE_MESSAGE } = require('../../constant');
const responseHandler = require('../../utils/responseHandler');
const accountsService = require('./accountsService');
<<<<<<< HEAD
const { validateImageInput, deleteFile } = require('./helper');
const {
  NotFoundError,
  // UnAuthorizedError,
  UnprocessableEntity,
} = require('../../utils/customError');
// const { verifyPassword } = require('../../utils/helper');
=======
const { NotFoundError } = require('../../utils/customError');
>>>>>>> d13ea9aa0c2d763ea23d2ad7ec510251dd6dd900

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
  const filters = { ...req.query };
  const accounts = await accountsService.getAccounts(filters);

  new responseHandler(res, accounts, 200, RESPONSE_MESSAGE.SUCCESS);
}

// async function checkCredentials(oldPassword, userPassword) {
//   if (!(await verifyPassword(oldPassword, userPassword))) {
//     throw new UnAuthorizedError('Invalid Credentials');
//   }
// }

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
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
  uploadProfilePicture,
<<<<<<< HEAD
  updatePassword,
=======
  deleteProfilePicture,
>>>>>>> d13ea9aa0c2d763ea23d2ad7ec510251dd6dd900
};
