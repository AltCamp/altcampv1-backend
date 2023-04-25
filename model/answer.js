const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    upvotes: {
      type: [mongoose.Types.ObjectId],
      ref: 'Account',
    },
    downvotes: {
      type: [mongoose.Types.ObjectId],
      ref: 'Account',
    },
    question: {
      type: mongoose.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  { timestamps: true }
);

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
