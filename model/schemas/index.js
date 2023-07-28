const { Schema, Types } = require('mongoose');

const authorSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const baseSchema = new Schema(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

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
