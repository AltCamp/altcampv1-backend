const router = require('express').Router();
const posts = require('./postsController');
const { verifyUser } = require('../../middleware/authenticate');
const {
  createPostValidator,
  updatePostValidator,
} = require('./postsValidator');
const validatorMiddleware = require('../../middleware/validator');
const limiter = require('../../middleware/rateLimit');

router
  .route('/')
  .get(posts.getAllPosts)
  .post(
    limiter(),
    verifyUser,
    validatorMiddleware(createPostValidator),
    posts.createPost
  );

router
  .route('/:id')
  .get(posts.getPost)
  .patch(
    limiter(),
    verifyUser,
    validatorMiddleware(updatePostValidator),
    posts.updatePost
  )
  .delete(verifyUser, posts.deletePost);

router.route('/:id/upvote').patch(verifyUser, posts.upvotePost);

module.exports = router;
