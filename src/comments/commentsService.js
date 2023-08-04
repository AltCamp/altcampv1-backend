const { Comment, Post } = require('../../model/');
const { addIsBookmarkedField } = require('../bookmarks/bookmarksService');

const getComment = async (id, { userId }) => {
  let comment = await Comment.findById(id);

  if (!userId) {
    comment = { ...comment.toJSON(), isBookmarked: false };
    return comment;
  }

  comment = await addIsBookmarkedField(comment, userId);

  return comment;
};

const getComments = async (postId, userId) => {
  let comments = await Comment.find({
    post: postId,
  });

  if (!userId) {
    comments = comments.map((comment) => {
      return { ...comment.toJSON(), isBookmarked: false };
    });
    return comments;
  }

  comments = await addIsBookmarkedField(comments, userId);
  return comments;
};

const createComment = async (comment) => {
  const newComment = await Comment.create(comment);
  newComment.post = comment.post;

  const post = await Post.findById({ _id: comment.post });
  post.comments = post.comments.concat(newComment._id);

  await post.save();
  await newComment.save();

  return newComment;
};

const updateComment = async (id, { content }) => {
  let updatedComment = await Comment.findByIdAndUpdate(
    id,
    { content },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  updatedComment = await addIsBookmarkedField(
    updatedComment,
    updatedComment?.author?._id
  );

  return updatedComment;
};

const upvoteComment = async ({ id, userId }) => {
  let comment = await Comment.findById(id);
  if (!comment) {
    return false;
  }

  if (comment.upvotedBy.includes(userId)) {
    const searchIndex = comment.upvotedBy.indexOf(userId);
    comment.upvotedBy.splice(searchIndex, 1);
  } else {
    comment.upvotedBy.push(userId);
  }
  comment.upvotes = comment.upvotedBy.length;

  if (comment.downvotedBy.includes(userId)) {
    const searchIndex = comment.downvotedBy.indexOf(userId);
    comment.downvotedBy.splice(searchIndex, 1);
    comment.downvotes = comment.downvotedBy.length;
  }

  await comment.save();
  comment = await addIsBookmarkedField(comment, userId);

  return comment;
};

const downvoteComment = async ({ id, userId }) => {
  let comment = await Comment.findById(id);
  if (!comment) {
    return false;
  }

  if (comment.downvotedBy.includes(userId)) {
    const searchIndex = comment.downvotedBy.indexOf(userId);
    comment.downvotedBy.splice(searchIndex, 1);
  } else {
    comment.downvotedBy.push(userId);
  }
  comment.downvotes = comment.downvotedBy.length;

  if (comment.upvotedBy.includes(userId)) {
    const searchIndex = comment.upvotedBy.indexOf(userId);
    comment.upvotedBy.splice(searchIndex, 1);
    comment.upvotes = comment.upvotedBy.length;
  }

  await comment.save();
  comment = await addIsBookmarkedField(comment, userId);

  return comment;
};

const isCommentAuthor = async ({ userId, commentId }) => {
  const { author } = await Comment.findById(commentId);
  return userId.toString() === author._id.toString();
};

module.exports = {
  getComment,
  getComments,
  createComment,
  updateComment,
  upvoteComment,
  downvoteComment,
  isCommentAuthor,
};
