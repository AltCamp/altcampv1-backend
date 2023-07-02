const Account = require('../model/account');
const bcrypt = require('bcrypt');
const config = require('../config/index');
const crypto = require('crypto');
const createDomPurify = require('dompurify');
const jwt = require('jsonwebtoken');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window);
const slugify = require('slugify');
const { logger } = require('handlebars');

/**
 * Helper class
 * @class Helper
 * @description Helper class to hold helper functions used throughout the application lifecycle
 */

class Helper {
  /**
   * @static createToken
   * @param {string} token - A token
   * @returns  {string} A hashed token
   * @description Creates a hashed token
   * @memberof Helper
   */
  static async createHashedToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * @static createToken
   * @param {object} payload - A payload object
   * @returns  {string} A JWT token
   * @description Creates a JWT token
   * @memberof Helper
   */
  static createToken(payload) {
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
      algorithm: 'HS256',
    });
    return token;
  }

  /**
   * @static generateSlug
   * @param {string} title - A title
   * @returns  {string} A slug
   * @description Generates a slug
   * @memberof Helper
   */
  static generateSlug(title) {
    return slugify(title, { lower: true, strict: true });
  }

  /**
   * @static sanitiseHTML - sanitises HTML content
   * @param {string} content - A content
   * @returns  {string} A sanitised content
   * @description Sanitises HTML content
   * @memberof Helper
   */
  static sanitiseHTML = (content) => {
    return domPurify.sanitize(content);
  };

  /**
   * @static validateCredentials
   * @param {string} email - An email
   * @param {string} password - A password
   * @returns  {object} A user object
   * @description Validates user credentials
   * @memberof Helper
   */

  static async validateCredentials(email, password) {
    const user = await Account.findOne({ email })
      .select('+password')
      .populate('owner', { __v: 0 });
    if (!user) return false;
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) return false;
    return user;
  }

  /**
   * @static verifyPassword
   * @param {string} plain - A plain text
   * @param {string} hashed - A hashed text
   * @returns  {boolean} A boolean
   * @description Verifies password
   * @memberof Helper
   */

  static async verifyPassword(plain, hashed) {
    return await bcrypt.compare(plain, hashed);
  }

  /**
   * @static tokenExpires
   * @param {number} ttl - A time to live
   * @returns  {string} A string
   * @description Returns a string
   * @memberof Helper
   */
  static tokenExpires(ttl) {
    const mttl = parseInt(ttl, 10);
    return `${mttl} minute${mttl === 1 ? 's' : ''}`;
  }

  /**
   * @static moduleErrLogMessager
   * @param {object} error - An error object
   * @returns  {object} An error object
   * @description Logs error messages
   * @memberof Helper
   */

  static moduleErrLogMessager(error) {
    return logger.error(`${error.status} - ${error.name} - ${error.message}`);
  }
}

module.exports = Helper;
