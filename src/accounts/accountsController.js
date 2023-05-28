const { RESPONSE_MESSAGE } = require('../../constant');
const responseHandler = require('../../utils/responseHandler');
const accountsService = require('./accountsService');

async function uploadProfilePicture(req, res, next) {
  try {
    const { profilePicture } = req.body;

    const account = await accountsService.uploadProfilePicture({
      id: req.user.id,
      image: profilePicture,
    });

    if (account instanceof Error) {
      return next(account);
    }

    new responseHandler(res, account, 200, RESPONSE_MESSAGE.SUCCESS);
  } catch (error) {
    return next(error);
  }
}

module.exports = { uploadProfilePicture };
