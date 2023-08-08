const router = require('express').Router();
const bookmarks = require('./bookmarksController');
const { verifyUser } = require('../../middleware/authenticate');
const { BookmarksValidator } = require('./bookmarksValidator');
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
  .route('/bulk-delete')
  .delete(
    validatorMiddleware(BookmarksValidator.validateBulkDeleteBookmarks()),
    bookmarks.deleteBookmarks
  );

router
  .route('/:id')
  .get(bookmarks.getBookmark)
  .patch(
    limiter(),
    validatorMiddleware(BookmarksValidator.validateUpdateBookmarks()),
    bookmarks.updateBookmark
  );

module.exports = router;
