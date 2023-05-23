const { RESPONSE_MESSAGE } = require('../../constant');
const responseHandler = require('../../utils/responseHandler');
const accountsService = require('./accountsService');
const { validateImageInput, deleteFile } = require('./helper');

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

module.exports = { uploadProfilePicture };
