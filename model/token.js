const mongoose = require('mongoose');
const { TOKEN_TYPE } = require('../constant');

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(TOKEN_TYPE),
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
    },
    expiresAt: {
      type: Date,
      expires: 900,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// tokenSchema.pre('save', function (next) {
//   if (this.type === TOKEN_TYPE.EMAIL_VERIFICATION) {
//     this.expiryTime = new Date(this.createdAt.getTime() + 1 * 15 * 60 * 1000);
//   } else if (this.type === TOKEN_TYPE.PASSWORD_RESET) {
//     this.expiryTime = new Date(this.createdAt.getTime() + 1 * 10 * 60 * 1000);
//   }

//   next();
// });

tokenSchema.index({ owner: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
