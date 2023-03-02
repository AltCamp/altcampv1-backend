const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Account',
      },
    ],
    downvotes: {
      type: Number,
      default: 0,
    },
    downvotedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Account',
      },
    ],
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    answer: {
      type: [mongoose.Types.ObjectId],
      ref: 'Answer',
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
