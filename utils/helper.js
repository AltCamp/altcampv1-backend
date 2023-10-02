const Account = require('../model/account');
const bcrypt = require('bcrypt');
const config = require('../config/index');
const crypto = require('crypto');
const createDomPurify = require('dompurify');
const jwt = require('jsonwebtoken');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window);
const slugify = require('slugify');
const { v4 } = require('uuid');
const { rm } = require('fs');

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

async function removeFromDisk(path) {
  return new Promise((resolve) => {
    resolve(
      rm(path, (err) => {
        if (err) console.error(err);
      })
    );
  });
}

function tokenExpires(ttl) {
  const mttl = Math.floor(parseInt(ttl, 10) / 60);
  return `${mttl} minute${mttl > 1 ? 's' : ''}`;
}

function generateId() {
  return v4();
}

function generate4DigitOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

module.exports = {
  createHashedToken,
  createToken,
  generate4DigitOTP,
  generateId,
  generateSlug,
  sanitiseHTML,
  validateCredentials,
  verifyPassword,
  tokenExpires,
  removeFromDisk,
};
