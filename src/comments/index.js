const router = require('express').Router();
const {
  authEmailIsVerified,
  authOptional,
} = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const { CommentsValidator } = require('./commentsValidator');
const comments = require('./commentsController');
const limiter = require('../../middleware/rateLimit');

router
  .route('/')
  .get(
    authOptional,
    validator.query(CommentsValidator.validateGetComments()),
    comments.getComments
  )
  .post(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(CommentsValidator.validateCreateComment()),
    comments.createComment
  );

router.route('/:id/upvote').patch(authEmailIsVerified, comments.upvoteComment);

router
  .route('/:id/downvote')
  .patch(authEmailIsVerified, comments.downvoteComment);

router
  .route('/:id')
  .get(
    authOptional,
    validator.params(CommentsValidator.validateGetComment()),
    comments.getComment
  )
  .patch(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(CommentsValidator.validateUpdateComment()),
    comments.updateComment
  );

module.exports = router;
