const mongoose = require('mongoose');
const { POST_TYPES } = require('../constant');

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
      enum: Object.values(POST_TYPES),
    },
    post: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: function () {
        switch (this.postType) {
          case POST_TYPES.ANSWER:
            return POST_TYPES.ANSWER;
          case POST_TYPES.COMMENT:
            return POST_TYPES.COMMENT;
          case POST_TYPES.POST:
            return POST_TYPES.POST;
          case POST_TYPES.QUESTION:
            return POST_TYPES.QUESTION;
        }
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
