const { AUTHOR_DETAILS } = require('../../constant');
const { Post } = require('../../model');

const getPosts = async ({ query } = {}) => {
  const posts = await Post.find(query).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return posts;
};

const getPost = async (postId) => {
  const post = await Post.findById(postId).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return post;
};

const createPost = async (post) => {
  const newPost = await Post.create(post);
  await newPost.populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  return newPost;
};

const updatePost = async ({ postId, post }) => {
  const updatedPost = await Post.findByIdAndUpdate(postId, post, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  await updatedPost.populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return updatedPost;
};

const deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);
  await post.populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });

  return post;
};

const isPostAuthor = async ({ userId, postId }) => {
  const { author } = await Post.findById(postId);
  return userId.toString() === author.toString();
};

const upvotePost = async ({ userId, postId }) => {
  const post = await Post.findById(postId).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
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
