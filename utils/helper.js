const Account = require('../model/account');
const bcrypt = require('bcrypt');
const config = require('../config/index');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

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

const generateSlug = (title) => {
  return slugify(title, { lower: true, strict: true });
};

module.exports = {
  createHashedToken,
  createToken,
  generateSlug,
  validateCredentials,
  verifyPassword,
};
