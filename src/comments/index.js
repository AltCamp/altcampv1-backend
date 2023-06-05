const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const {
  createCommentValidator,
  getCommentValidator,
  getCommentsValidator,
  updateCommentValidator,
} = require('./commentsValidator');
const comments = require('./commentsController');
const limiter = require('../../middleware/rateLimit');

router.use(verifyUser);
router
  .route('/')
  .get(validator.query(getCommentsValidator), comments.getComments)
  .post(
    limiter(),
    validatorMiddleware(createCommentValidator),
    comments.createComment
  );

router.route('/:id/upvote').patch(comments.upvoteComment);

router.route('/:id/downvote').patch(comments.downvoteComment);

router
  .route('/:id')
  .get(validator.params(getCommentValidator), comments.getComment)
  .patch(
    limiter(),
    validatorMiddleware(updateCommentValidator),
    comments.updateComment
  );

module.exports = router;
