const router = require('express').Router();
const posts = require('./postsController');
const {
  authEmailIsVerified,
  authOptional,
} = require('../../middleware/authenticate');
const {
  createPostValidator,
  updatePostValidator,
} = require('./postsValidator');
const validatorMiddleware = require('../../middleware/validator');
const { paginationSchema, validator } = require('../common');
const limiter = require('../../middleware/rateLimit');
const { upload } = require('../../middleware/multer');

router
  .route('/')
  .get(authOptional, validator.query(paginationSchema), posts.getAllPosts)
  .post(
    limiter(),
    authEmailIsVerified,
    upload.array('files'),
    validatorMiddleware(createPostValidator),
    posts.createPost
  );

router
  .route('/:id')
  .get(authOptional, posts.getPost)
  .patch(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(updatePostValidator),
    posts.updatePost
  )
  .delete(authEmailIsVerified, posts.deletePost);

router.route('/:id/upvote').patch(authEmailIsVerified, posts.upvotePost);

module.exports = router;
