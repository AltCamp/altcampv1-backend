const { Token } = require('../../model');
const { BadRequestError } = require('../../utils/customError');

class TokenService {
  static async createToken({ type, owner, timeToLive }) {
    const otpCode = Math.floor(Math.random() * 9000) + 1000;
    const ttlMs = Date.now() + 60 * 1000 * timeToLive;
    const expiresAt = new Date(ttlMs);

    const data = await Token.create({ token: otpCode, owner, type, expiresAt });
    if (!data)
      throw new BadRequestError('An error occurred while creating token!');
    return data;
  }

  static async getToken(where) {
    return await Token.findOne(where);
  }

  static async deleteToken(_id) {
    return await Token.deleteOne(_id);
  }
}
module.exports = TokenService;
