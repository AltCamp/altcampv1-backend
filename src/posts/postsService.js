const { Post } = require('../../model');
const { apiFeatures } = require('../common');

const getPosts = async ({ query } = {}) => {
  const postsQuery = Post.find({});
  const posts = await new apiFeatures(postsQuery, query)
    .filter()
    .sort()
    .paginate();
  return posts;
};

const getPost = async (postId) => {
  const post = await Post.findById(postId);

  return post;
};

const createPost = async (post) => {
  const newPost = await Post.create(post);

  return newPost;
};

const updatePost = async ({ postId, post }) => {
  const updatedPost = await Post.findByIdAndUpdate(postId, post, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  return updatedPost;
};

const deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);

  return post;
};

const isPostAuthor = async ({ userId, postId }) => {
  const { author } = await Post.findById(postId);
  return userId.toString() === author._id.toString();
};

const upvotePost = async ({ userId, postId }) => {
  const post = await Post.findById(postId);
  if (!post) {
    return false;
  }

  if (post.upvotedBy.includes(userId)) {
    post.upvotes--;
    const searchIndex = post.upvotedBy.indexOf(userId);
    post.upvotedBy.splice(searchIndex, 1);

    await post.save();

    return post;
  }

  post.upvotes++;
  post.upvotedBy.push(userId);
  await post.save();

  return post;
};

module.exports = {
  createPost,
  deletePost,
  getPosts,
  getPost,
  isPostAuthor,
  updatePost,
  upvotePost,
};
