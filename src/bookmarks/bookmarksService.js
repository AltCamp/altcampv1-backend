const { apiFeatures } = require('../common');
const { AUTHOR_DETAILS, POST_DETAILS } = require('../../constant');
const { Bookmark } = require('../../model');

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

const createBookmark = async ({ author, postId, postType, title }) => {
  const newBookmark = await Bookmark.create({
    title,
    postType,
    post: postId,
    owner: author,
  });

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

const deleteBookmark = async (bookmarkId) => {
  const bookmark = await Bookmark.findByIdAndDelete(bookmarkId)
    .populate({
      path: 'owner',
      select: Object.values(AUTHOR_DETAILS),
    })
    .populate('post', {
      content: 1,
      body: 1,
    });

  return bookmark;
};

const isBookmarkOwner = async ({ userId, bookmarkId }) => {
  const { owner } = await Bookmark.findById(bookmarkId);
  return userId.toString() === owner.toString();
};

const addIsBookmarkedField = async (resources, userId) => {
  const _resources = { ...resources };
  try {
    const resourceIds = _resources.data.map((resource) => resource.id);
    let bookmarks = await Bookmark.find({
      id: { $in: [resourceIds] },
      owner: userId,
    });
    bookmarks = bookmarks.map((each) => each.post.toString());

    _resources.data = _resources.data.map((resource) => {
      if (bookmarks.includes(resource.id)) {
        return { ...resource.toJSON(), isBookmarked: true };
      } else {
        return { ...resource.toJSON(), isBookmarked: false };
      }
    });
    return _resources;
  } catch (error) {
    return resources;
  }
};

const addIsBookmarkedField2 = async (resources, userId) => {
  let _resources = [...resources];
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
    return _resources;
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
  isBookmarkOwner,
  addIsBookmarkedField,
  addIsBookmarkedField2,
};
