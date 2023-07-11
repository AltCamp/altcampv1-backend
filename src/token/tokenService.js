const { BadRequestError } = require('../../utils/customError');
const { generate4DigitOTP } = require('../../utils/helper');
const redisClient = require('../common/cache/cacheService');

class TokenService {
  static async createToken({ requestId, type, owner, timeToLive }) {
    const otpCode = generate4DigitOTP();

    try {
      await redisClient.set(
        `${type + requestId}`,
        JSON.stringify({ token: otpCode, owner }),
        { EX: timeToLive }
      );
      return otpCode;
    } catch (error) {
      throw new BadRequestError('An error occurred while creating token!');
    }
  }

  static async getToken(where) {
    const token = await redisClient.get(where);
    return token ? JSON.parse(token) : token;
  }

  static async deleteToken(_id) {
    return await redisClient.del(_id);
  }
}
module.exports = TokenService;
