const { model, Schema, Types } = require('mongoose');
const { sanitiseHTML } = require('../utils/helper');
const { authorSchema, baseSchema, likeSchema } = require('./schemas');

const postSchema = new Schema(
  {
    comments: {
      type: [Types.ObjectId],
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

const Post = model(
  'Post',
  baseSchema.clone().add(postSchema).add(authorSchema).add(likeSchema)
);

module.exports = Post;
