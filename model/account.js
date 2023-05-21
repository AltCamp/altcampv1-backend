const mongoose = require('mongoose');
const { ACCOUNT_TYPES, GENDER } = require('../constant');
const bcrypt = require('bcrypt');
const { UnprocessableEntity } = require('../utils/customError');

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    track: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    accountType: {
      type: String,
      enum: Object.values(ACCOUNT_TYPES),
      default: ACCOUNT_TYPES.STUDENT,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: function () {
        switch (this.accountType) {
          case ACCOUNT_TYPES.MENTOR:
            return ACCOUNT_TYPES.MENTOR;
          case ACCOUNT_TYPES.ADMIN:
            return ACCOUNT_TYPES.ADMIN;
          default:
            return ACCOUNT_TYPES.STUDENT;
        }
      },
    },
  },
  { timestamps: true }
);

// encrypt password before saving document
accountSchema.pre('save', async function (next) {
  const user = this;

  // do nothing if the password is not modified
  if (!user.isModified('password')) return next();

  // check password validity
  if (!validatePassword(user.password)) {
    throw new UnprocessableEntity(
      'password must contain uppercase, lowercase, number and special character'
    );
  }

  // hash the password using our new salt
  try {
    await hashPassword(user);
  } catch (error) {
    next(error);
  }

  next();
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;

async function hashPassword(user) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (error) {
    throw new Error('Hashing failed:', error);
  }
}

function validatePassword(password) {
  const pattern =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
  return pattern.test(password);
}
