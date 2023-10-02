const { model, Schema, Types } = require('mongoose');
const { MEDIA_TYPE } = require('../constant');

const mediaSchema = new Schema(
  {
    url: {
      type: String,
    },
    assetId: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(MEDIA_TYPE),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'Account',
      select: false,
    },
  },
  { timestamps: true }
);

const Media = model('Media', mediaSchema);

module.exports = Media;
