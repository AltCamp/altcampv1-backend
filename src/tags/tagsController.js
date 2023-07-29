const TagsService = require('./tagsService');
const { RESPONSE_MESSAGE } = require('../../constant');
const responseHandler = require('../../utils/responseHandler');

const tagsService = new TagsService();

class TagsController {
  async getTags(req, res) {
    const { data, meta } = await tagsService.getTags(req);
    return new responseHandler(res, data, 200, RESPONSE_MESSAGE.SUCCESS, meta);
  }
}

module.exports = TagsController;
