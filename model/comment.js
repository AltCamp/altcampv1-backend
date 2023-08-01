const { model, Schema, Types } = require('mongoose');
const {
  authorSchema,
  baseSchema,
  dislikeSchema,
  likeSchema,
} = require('./schemas');

const commentSchema = new Schema(
  {
    post: {
      type: Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model(
  'Comment',
  baseSchema
    .clone()
    .add(commentSchema)
    .add(authorSchema)
    .add(dislikeSchema)
    .add(likeSchema)
);

module.exports = Comment;
