const Bookmark = require('../../model/bookmark');

const getBookmarks = async (owner) => {
  const bookmarks = await Bookmark.find({ owner })
    .populate('owner', {
      firstName: 1,
      lastName: 1,
    })
    .populate('post', {
      content: 1,
      body: 1,
    });

  return bookmarks;
};

const getBookmark = async (bookmarkId) => {
  const bookmark = await Bookmark.findById(bookmarkId)
    .populate('owner', {
      firstName: 1,
      lastName: 1,
    })
    .populate('post', {
      content: 1,
      body: 1,
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

  await newBookmark.populate('owner', {
    firstName: 1,
    lastName: 1,
  });

  await newBookmark.populate('post', {
    content: 1,
    body: 1,
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
    .populate('owner', {
      firstName: 1,
      lastName: 1,
    })
    .populate('post', {
      content: 1,
      body: 1,
    });

  return updatedBookmark;
};

const deleteBookmark = async (bookmarkId) => {
  const bookmark = await Bookmark.findByIdAndDelete(bookmarkId)
    .populate('owner', {
      firstName: 1,
      lastName: 1,
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

module.exports = {
  getBookmarks,
  getBookmark,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  isBookmarkOwner,
};
