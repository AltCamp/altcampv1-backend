const { apiFeatures } = require('../common');
const {
  AUTHOR_DETAILS,
  POST_DETAILS,
  RESPONSE_MESSAGE,
} = require('../../constant');
const { Bookmark } = require('../../model');
const { NotFoundError } = require('../../utils/customError');

const getBookmarks = async (owner, { query }) => {
  const bookmarksQuery = Bookmark.find({ owner })
    .populate({
      path: 'owner',
      select: Object.values(AUTHOR_DETAILS),
    })
    .populate({
      path: 'post',
      populate: [
        {
          path: 'author',
          model: 'Account',
          select: Object.values(AUTHOR_DETAILS),
        },
        {
          path: 'question',
          model: 'Question',
          select: Object.values(POST_DETAILS),
        },
      ],
    });
  const bookmarks = await new apiFeatures(bookmarksQuery, query)
    .filter()
    .sort()
    .paginate();
  return bookmarks;
};

const getBookmark = async (bookmarkId) => {
  const bookmark = await Bookmark.findById(bookmarkId)
    .populate({
      path: 'owner',
      select: Object.values(AUTHOR_DETAILS),
    })
    .populate({
      path: 'post',
      populate: [
        {
          path: 'author',
          model: 'Account',
          select: Object.values(AUTHOR_DETAILS),
        },
        {
          path: 'question',
          model: 'Question',
          select: Object.values(POST_DETAILS),
        },
      ],
    });

  return bookmark;
};

const createBookmark = async (payload) => {
  const newBookmark = await Bookmark.create(payload);

  await newBookmark.populate({
    path: 'owner',
    select: Object.values(AUTHOR_DETAILS),
  });

  await newBookmark.populate({
    path: 'post',
    populate: [
      {
        path: 'author',
        model: 'Account',
        select: Object.values(AUTHOR_DETAILS),
      },
      {
        path: 'question',
        model: 'Question',
        select: Object.values(POST_DETAILS),
      },
    ],
  });

  return newBookmark;
};

const deleteBookmark = async ({ author, postId }) => {
  const bookmarkToDelete = await Bookmark.findOne({
    owner: author,
    post: postId,
  });
  if (!bookmarkToDelete)
    throw new NotFoundError(RESPONSE_MESSAGE.NOT_FOUND('Bookmark'));

  const payload = {
    bookmarkIds: [bookmarkToDelete._id],
    userId: author,
  };
  return await deleteBookmarks(payload);
};

const updateBookmark = async ({ bookmarkId, bookmark }) => {
  const updatedBookmark = await Bookmark.findByIdAndUpdate(
    bookmarkId,
    bookmark,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .populate({
      path: 'owner',
      select: Object.values(AUTHOR_DETAILS),
    })
    .populate({
      path: 'post',
      populate: {
        path: 'author',
        model: 'Account',
        select: Object.values(AUTHOR_DETAILS),
      },
    });

  return updatedBookmark;
};

const deleteBookmarks = async ({ bookmarkIds, userId }) => {
  const deletedBookmarks = await Bookmark.deleteMany({
    _id: { $in: bookmarkIds },
    author: userId,
  });

  return deletedBookmarks;
};

const isBookmarkOwner = async ({ userId, bookmarkId }) => {
  const { owner } = await Bookmark.findById(bookmarkId);
  return userId.toString() === owner.toString();
};

const addIsBookmarkedField = async (resources, userId) => {
  const isArray = Array.isArray(resources);
  let _resources = isArray ? [...resources] : [resources];

  try {
    const resourceIds = _resources.map((resource) => resource._id.toString());

    let bookmarks = await Bookmark.find({
      id: { $in: [resourceIds] },
      owner: userId,
    });
    bookmarks = bookmarks.map((each) => each.post.toString());

    _resources = _resources.map((resource) => {
      if (bookmarks.includes(resource.id)) {
        return { ...resource.toJSON(), isBookmarked: true };
      } else {
        return { ...resource.toJSON(), isBookmarked: false };
      }
    });
    return isArray ? _resources : _resources[0];
  } catch (error) {
    return resources;
  }
};

module.exports = {
  getBookmarks,
  getBookmark,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  deleteBookmarks,
  isBookmarkOwner,
  addIsBookmarkedField,
};
