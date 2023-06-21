const router = require('express').Router();
const bookmarks = require('./bookmarksController');
const { verifyUser } = require('../../middleware/authenticate');
const {
  createBookmarkValidator,
  updateBookmarkValidator,
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
    validatorMiddleware(createBookmarkValidator),
    bookmarks.createBookmark
  );

router
  .route('/:id')
  .get(bookmarks.getBookmark)
  .patch(
    limiter(),
    validatorMiddleware(updateBookmarkValidator),
    bookmarks.updateBookmark
  )
  .delete(bookmarks.deleteBookmark);

module.exports = router;
