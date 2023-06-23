const Token = require('../model/token');
const { BadRequestError } = require('../utils/customError');

class TokenService {
  static async createToken({ token, type, owner }) {
    const data = await Token.create({ token, owner, type });
    if (!data)
      throw new BadRequestError('An error occurred while creating token!');
    return data;
  }

  static async getToken(where) {
    return await Token.findOne(where);
  }
}
module.exports = TokenService;