const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');

async function hashPassword(user) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (error) {
    throw new Error('Hashing failed:', error);
  }
}

// login
const login = (req, res, { err, user, info }) => {
  if (err || !user) {
    return res
      .status(401)
      .json({ message: info?.message || 'Login failed', error: err || '' });
  }

  req.login(user, { session: false }, async (error) => {
    if (error) return res.status(401).json({ message: error.message });

    const body = { _id: user._id, email: user.email };

    const token = jwt.sign({ user: body }, CONFIG.jwt.secret, {
      expiresIn: CONFIG.jwt.expiry,
    });

    return res.status(200).json({ message: 'Login successful', token });
  });
};

module.exports = { hashPassword, login };
