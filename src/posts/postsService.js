const Post = require('../../model/post');

const getPosts = async ({ query } = {}) => {
  const posts = await Post.find(query).populate('author', {
    firstName: 1,
    lastName: 1,
  });

  return posts;
};

const getPost = async (postId) => {
  const post = await Post.findById(postId).populate('author', {
    firstName: 1,
    lastName: 1,
  });

  return post;
};

const createPost = async (post) => {
  const newPost = await Post.create(post);
  await newPost.populate('author', {
    firstName: 1,
    lastName: 1,
  });
  return newPost;
};

const updatePost = async ({ postId, post }) => {
  const updatedPost = await Post.findByIdAndUpdate(postId, post, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  await updatedPost.populate('author', {
    firstName: 1,
    lastName: 1,
  });

  return updatedPost;
};

const deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);
  await post.populate('author', {
    firstName: 1,
    lastName: 1,
  });

  return post;
};

const isPostAuthor = async ({ userId, postId }) => {
  const { author } = await Post.findById(postId);
  return userId.toString() === author.toString();
};

const upvotePost = async ({ userId, postId }) => {
  const post = await Post.findById(postId).populate('author', {
    firstName: 1,
    lastName: 1,
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
