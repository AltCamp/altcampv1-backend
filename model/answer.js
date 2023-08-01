const { model, Schema, Types } = require('mongoose');
const {
  authorSchema,
  baseSchema,
  dislikeSchema,
  likeSchema,
} = require('./schemas');

const answerSchema = new Schema(
  {
    question: {
      type: Types.ObjectId,
      ref: 'Question',
      required: true,
    },
  },
  { timestamps: true }
);

const Answer = model(
  'Answer',
  baseSchema
    .clone()
    .add(answerSchema)
    .add(authorSchema)
    .add(dislikeSchema)
    .add(likeSchema)
);

module.exports = Answer;
