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
      expires: 0,
    },
  },
  { timestamps: true }
);

tokenSchema.index({ owner: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
