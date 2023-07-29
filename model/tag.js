const { model, Schema, Types } = require('mongoose');

const tagSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'Account',
      select: false,
    },
  },
  { timestamps: true }
);

tagSchema.index({ name: 1 });

const Tag = model('Tag', tagSchema);

module.exports = Tag;
