const mongoose = require('mongoose');
const { Helper } = require('../utils');

const { sanitiseHTML } = Helper;

const postSchema = new mongoose.Schema(
  {
    content: {
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
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre('findOneAndUpdate', async function (next) {
  let update = this.getUpdate();
  const { content } = update;

  if (content) {
    const purifiedContent = sanitiseHTML(content);
    update = { ...update, content: purifiedContent };
    this.setUpdate(update);
  }

  next();
});

postSchema.pre('validate', function (next) {
  if (this.content) {
    this.content = sanitiseHTML(this.content);
  }

  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
