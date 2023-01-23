const mongoose = require('mongoose');
const { ACCOUNT_TYPES } = require('../constant');

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
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
    accountType: {
      type: String,
      enum: Object.values(ACCOUNT_TYPES),
      default: ACCOUNT_TYPES.STUDENT,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: function () {
        switch (ACCOUNT_TYPES) {
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

// accountSchema.pre('save', async function (next) {
//   const user = this;
//   try {
//     if (user.isModified('password') || user.isNew) {
//       await hashPassword(user);
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// accountSchema.methods.isValidPassword = async function (password) {
//   const user = this;
//   try {
//     return await bcrypt.compare(password, user.password);
//   } catch (error) {
//     console.log(error);
//   }
// };

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
