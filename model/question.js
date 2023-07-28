const { model, Schema, Types } = require('mongoose');
const {
  authorSchema,
  baseSchema,
  dislikeSchema,
  likeSchema,
} = require('./schemas');
const { generateSlug, sanitiseHTML } = require('../utils/helper');

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
    answer: {
      type: [Types.ObjectId],
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

const Question = model(
  'Question',
  baseSchema
    .clone()
    .add(questionSchema)
    .add(authorSchema)
    .add(dislikeSchema)
    .add(likeSchema)
);

module.exports = Question;
