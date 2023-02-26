const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  answer: {
    type: [mongoose.Types.ObjectId],
    ref: 'Answer',
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
