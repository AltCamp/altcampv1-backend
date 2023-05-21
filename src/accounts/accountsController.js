const { RESPONSE_MESSAGE } = require('../../constant');
const { NotFoundError } = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const accountsService = require('./accountsService');
const { imageValidator } = require('./accountsValidator');

async function uploadProfilePicture(req, res) {
  try {
  const { error } = imageValidator.validate(req.file);

  if (error) {
    throw new Error(error);
  }

  const account = await accountsService.uploadProfilePicture({
    id: req.user.id,
    filepath: req.file.path,
  });

  if (!account) {
    throw new NotFoundError('Account not found!');
  }

  new responseHandler(res, account, 200, RESPONSE_MESSAGE.SUCCESS);
  } catch (error) {
    console.log('An error occured: ', error);
  }
}

module.exports = { uploadProfilePicture };
