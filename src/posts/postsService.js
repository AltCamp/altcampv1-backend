const { Post } = require('../../model');
const { addIsBookmarkedField } = require('../bookmarks/bookmarksService');
const { apiFeatures } = require('../common');

const getPosts = async ({ query } = {}, { userId }) => {
  const postsQuery = Post.find({});
  const posts = await new apiFeatures(postsQuery, query)
    .filter()
    .sort()
    .paginate();

  if (!userId) {
    posts.data = posts.data.map((post) => {
      return { ...post.toJSON(), isBookmarked: false };
    });
    return posts;
  }
  posts.data = await addIsBookmarkedField(posts.data, userId);
  return posts;
};

const getPost = async (postId, { userId }) => {
  let post = await Post.findById(postId);

  if (!userId) {
    post = { ...post.toJSON(), isBookmarked: false };
    return post;
  }

  post = await addIsBookmarkedField(post, userId);
  return post;
};

const createPost = async (post) => {
  const newPost = await Post.create(post);

  return newPost;
};

const updatePost = async ({ postId, post }) => {
  let updatedPost = await Post.findByIdAndUpdate(postId, post, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  updatedPost = await addIsBookmarkedField(
    updatedPost,
    updatedPost?.author?._id
  );
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
  let post = await Post.findById(postId);
  if (!post) {
    return false;
  }

  if (post.upvotedBy.includes(userId)) {
    const searchIndex = post.upvotedBy.indexOf(userId);
    post.upvotedBy.splice(searchIndex, 1);
  } else {
    post.upvotedBy.push(userId);
  }
  post.upvotes = post.upvotedBy.length;

  await post.save();
  post = await addIsBookmarkedField(post, userId);

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
