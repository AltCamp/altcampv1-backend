const Account = require('../model/account');
const bcrypt = require('bcrypt');
const config = require('../config/index');
const crypto = require('crypto');
const createDomPurify = require('dompurify');
const jwt = require('jsonwebtoken');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window);
const slugify = require('slugify');
const moment = require('moment');

const createHashedToken = (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  return hashedToken;
};

const createToken = (payload) => {
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiry,
    algorithm: 'HS256',
  });
  return token;
};

const generateSlug = (title) => {
  return slugify(title, { lower: true, strict: true });
};

const sanitiseHTML = (content) => {
  return domPurify.sanitize(content);
};

async function validateCredentials(email, password) {
  const user = await Account.findOne({ email })
    .select('+password')
    .populate('owner', { __v: 0 });
  if (!user) return false;
  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) return false;
  return user;
}

async function verifyPassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

function getDifferenceInMinutes({ createdAt, expiryTime }) {
  const mExpiryTime = moment(expiryTime);
  const mCreatedAt = moment(createdAt);
  const diff = mExpiryTime.diff(mCreatedAt, 'minutes');
  return `${diff} minute${diff > 1 ? 's' : ''}`;
}

module.exports = {
  createHashedToken,
  createToken,
  generateSlug,
  sanitiseHTML,
  validateCredentials,
  verifyPassword,
  getDifferenceInMinutes,
};
