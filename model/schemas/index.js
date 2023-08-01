const { Schema, Types } = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const { AUTHOR_DETAILS, TAG_DETAILS } = require('../../constant');

const authorSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: 'Account',
      required: true,
      autopopulate: { select: Object.values(AUTHOR_DETAILS) },
    },
  },
  {
    timestamps: true,
  }
);
authorSchema.plugin(autopopulate);

const baseSchema = new Schema(
  {
    content: {
      type: String,
    },
    tags: {
      type: [Types.ObjectId],
      ref: 'Tag',
      autopopulate: { select: Object.values(TAG_DETAILS) },
    },
  },
  {
    timestamps: true,
  }
);
baseSchema.plugin(autopopulate);

const dislikeSchema = new Schema({
  downvotes: {
    type: Number,
    default: 0,
  },
  downvotedBy: [
    {
      type: Types.ObjectId,
      ref: 'Account',
    },
  ],
});

const likeSchema = new Schema({
  upvotes: {
    type: Number,
    default: 0,
  },
  upvotedBy: [
    {
      type: Types.ObjectId,
      ref: 'Account',
    },
  ],
});

module.exports = {
  authorSchema,
  baseSchema,
  dislikeSchema,
  likeSchema,
};
