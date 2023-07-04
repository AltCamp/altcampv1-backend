const { AUTHOR_DETAILS } = require('../../constant');
const { Post, Bookmark } = require('../../model');
const { apiFeatures } = require('../common');

const getPosts = async ({ query } = {}, { userId }) => {
  const postsQuery = Post.find({}).populate({
    path: 'author',
    select: Object.values(AUTHOR_DETAILS),
  });
  let posts = await new apiFeatures(postsQuery, query)
    .filter()
    .sort()
    .paginate();

  if (!userId) {
    posts.data = posts.data.map((post) => {
      return { ...post.toJSON(), isBookmarked: false };
    });
    return posts;
  }
  const postIds = posts.data.map((post) => post.id);
  let bookmarks = await Bookmark.find({
    id: { $in: [postIds] },
    owner: userId,
  });
  bookmarks = bookmarks.map((each) => each.post.toString());
  posts.data = posts.data.map((post) => {
    if (bookmarks.includes(post.id)) {
      return { ...post.toJSON(), isBookmarked: true };
    } else {
      return { ...post.toJSON(), isBookmarked: false };
    }
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
