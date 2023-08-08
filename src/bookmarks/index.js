const router = require('express').Router();
const bookmarks = require('./bookmarksController');
const { verifyUser } = require('../../middleware/authenticate');
const {
  createBookmarkValidator,
  updateBookmarkValidator,
  BookmarksValidator,
} = require('./bookmarksValidator');
const validatorMiddleware = require('../../middleware/validator');
const { paginationSchema, validator } = require('../common');
const limiter = require('../../middleware/rateLimit');

router.use(verifyUser);
router
  .route('/')
  .get(validator.query(paginationSchema), bookmarks.getAllBookmarks)
  .post(
    limiter(),
    validator.query(BookmarksValidator.validateCreateBookmark()),
    bookmarks.createBookmark
  )
  .delete(
    limiter(),
    validator.query(BookmarksValidator.validateDeleteBookmark()),
    bookmarks.deleteBookmark
  );

router
  .route('/:id')
  .get(bookmarks.getBookmark)
  .patch(
    limiter(),
    validatorMiddleware(updateBookmarkValidator),
    bookmarks.updateBookmark
  );

module.exports = router;
