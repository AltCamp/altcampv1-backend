const { model, Schema, Types } = require('mongoose');
const { sanitiseHTML } = require('../utils/helper');
const { authorSchema, baseSchema, likeSchema } = require('./schemas');
const autopopulate = require('mongoose-autopopulate');

const postSchema = new Schema(
  {
    comments: {
      type: [Types.ObjectId],
      ref: 'Comment',
    },
    media: {
      type: [Types.ObjectId],
      ref: 'Media',
      autopopulate: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

postSchema.plugin(autopopulate);

const Post = model(
  'Post',
  baseSchema.clone().add(postSchema).add(authorSchema).add(likeSchema)
);

module.exports = Post;
