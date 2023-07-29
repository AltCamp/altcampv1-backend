const tracksService = require('./tracksService');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const getTracks = async (req, res) => {
  const tracks = await tracksService.getTracks();

  new responseHandler(res, tracks, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = { getTracks };
