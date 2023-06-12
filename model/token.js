const mongoose = require('mongoose');
const { TOKEN_TYPE } = require('../constant');

const tokenSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiryTime: {
    type: Date,
  },
});

tokenSchema.pre('save', function (next) {
  this.expiryTime = new Date(
    this.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000 // A day expiry
  );
  next();
});

tokenSchema.index({ owner: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
