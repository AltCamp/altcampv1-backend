const bcrypt = require('bcrypt');

async function hashPassword(user) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (error) {
    throw new Error('Hashing failed:', error);
  }
}

module.exports = { hashPassword };
