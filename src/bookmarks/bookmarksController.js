const bookmarksService = require('./bookmarksService');
const {
  NotFoundError,
  UnAuthorizedError,
  ConflictError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const getBookmark = async (req, res) => {
  const bookmarkId = req.params.id;

  const isOwner = await bookmarksService.isBookmarkOwner({
    userId: req.user._id,
    bookmarkId,
  });
  if (!isOwner) throw new NotFoundError('Not Found');

  const bookmark = await bookmarksService.getBookmark(bookmarkId);

  if (!bookmark) throw new NotFoundError('Not Found');

  new responseHandler(res, bookmark, 200, RESPONSE_MESSAGE.SUCCESS);
};

const getAllBookmarks = async (req, res) => {
  const owner = req.user._id;
  const { data, meta } = await bookmarksService.getBookmarks(owner, req);
  new responseHandler(res, data, 200, RESPONSE_MESSAGE.SUCCESS, meta);
};

const deleteBookmark = async (req, res) => {
  const { postId } = req.query;

  const deletedBookmark = await bookmarksService.deleteBookmark({
    author: req.user._id,
    postId,
  });

  new responseHandler(res, deletedBookmark, 200, RESPONSE_MESSAGE.SUCCESS);
};

const createBookmark = async (req, res) => {
  const { postId, postType } = req.query;
  req.query.isPaginated = false;
  const { data: bookmarks } = await bookmarksService.getBookmarks(
    req.user._id,
    req
  );

  const bookmarkExists = bookmarks.some(
    (bookmark) => bookmark.post?._id.toString() === postId
  );

  if (bookmarkExists) {
    throw new ConflictError(RESPONSE_MESSAGE.CONFLICT('Bookmark'));
  }

  const newBookmark = await bookmarksService.createBookmark({
    post: postId,
    postType,
    owner: req.user._id,
  });

  new responseHandler(res, newBookmark, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updateBookmark = async (req, res) => {
  const bookmarkId = req.params.id;

  const isOwner = await bookmarksService.isBookmarkOwner({
    userId: req.user._id,
    bookmarkId,
  });

  if (!isOwner) throw new UnAuthorizedError('Unauthorized');

  const bookmark = { ...req.body };

  const updatedBookmark = await bookmarksService.updateBookmark({
    bookmarkId,
    bookmark,
  });

  if (!updatedBookmark) throw new NotFoundError('Not Found');

  new responseHandler(res, updatedBookmark, 200, RESPONSE_MESSAGE.SUCCESS);
};

const deleteBookmarks = async (req, res) => {
  const userId = req.user._id;

  const { bookmarkIds } = req.body;
  const deletedBookmarks = await bookmarksService.deleteBookmarks({
    bookmarkIds,
    userId,
  });

  new responseHandler(res, deletedBookmarks, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  getBookmark,
  getAllBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  deleteBookmarks,
};
