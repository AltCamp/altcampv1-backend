const router = require('express').Router();
const {
  authEmailIsVerified,
  authOptional,
} = require('../../middleware/authenticate');
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

router
  .route('/')
  .get(
    authOptional,
    validator.query(getCommentsValidator),
    comments.getComments
  )
  .post(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(createCommentValidator),
    comments.createComment
  );

router.route('/:id/upvote').patch(authEmailIsVerified, comments.upvoteComment);

router
  .route('/:id/downvote')
  .patch(authEmailIsVerified, comments.downvoteComment);

router
  .route('/:id')
  .get(authOptional, validator.params(getCommentValidator), comments.getComment)
  .patch(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(updateCommentValidator),
    comments.updateComment
  );

module.exports = router;
