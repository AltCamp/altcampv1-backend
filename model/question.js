const mongoose = require('mongoose');
const { generateSlug, sanitiseHTML } = require('../utils/helper');

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
    slug: {
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

questionSchema.pre('findOneAndUpdate', async function (next) {
  let update = this.getUpdate();
  const { title, body } = update;

  if (title) {
    const slug = generateSlug(title);
    update = { ...update, slug };
    this.setUpdate(update);
  }

  if (body) {
    const purifiedBody = sanitiseHTML(body);
    update = { ...update, body: purifiedBody };
    this.setUpdate(update);
  }

  next();
});

questionSchema.pre('validate', function (next) {
  if (this.body) {
    this.body = sanitiseHTML(this.body);
  }

  if (this.isModified('title')) {
    const slug = generateSlug(this.title);
    this.slug = slug;
  }

  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
