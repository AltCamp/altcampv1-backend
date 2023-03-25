const bcrypt = require('bcrypt');
const Account = require('../model/account');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/index');

async function verifyPassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

async function validateCredentials(email, password) {
  const user = await Account.findOne({ email })
    .select('+password')
    .populate('owner', { __v: 0 });
  if (!user) return false;
  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) return false;
  return user;
}

const createToken = (payload) => {
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiry,
    algorithm: 'HS256',
  });
  return token;
};

const createHashedToken = (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  return hashedToken;
};

module.exports = {
  verifyPassword,
  validateCredentials,
  createToken,
  createHashedToken,
};
