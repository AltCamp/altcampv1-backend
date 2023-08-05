const commentService = require('./commentsService');
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const getComment = async (req, res) => {
  const { id } = req.params;

  const comments = await commentService.getComment(id, {
    userId: req.user?._id,
  });

  new responseHandler(res, comments, 200, RESPONSE_MESSAGE.SUCCESS);
};

const getComments = async (req, res) => {
  const { postId } = req.query;
  const userId = req.user?._id;

  const comments = await commentService.getComments(postId, userId);

  new responseHandler(res, comments, 200, RESPONSE_MESSAGE.SUCCESS);
};

const createComment = async (req, res) => {
  const { content, postId } = req.body;

  const comment = await commentService.createComment({
    content,
    post: postId,
    author: req.user._id,
  });

  new responseHandler(res, comment, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updateComment = async (req, res) => {
  const { id } = req.params;

  const isAuthor = await commentService.isCommentAuthor({
    userId: req.user._id,
    commentId: id,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const { content } = req.body;
  const updatedComment = await commentService.updateComment(id, { content });
  if (!updatedComment) throw new NotFoundError('Not Found');

  new responseHandler(res, updatedComment, 200, RESPONSE_MESSAGE.SUCCESS);
};

const upvoteComment = async (req, res) => {
  const { id } = req.params;

  const upvote = await commentService.upvoteComment({
    id,
    userId: req.user._id,
  });

  if (!upvote) throw new BadRequestError('Unable to upvote comment');

  new responseHandler(res, upvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

const downvoteComment = async (req, res) => {
  const { id } = req.params;

  const downvote = await commentService.downvoteComment({
    id,
    userId: req.user._id,
  });

  if (!downvote) throw new BadRequestError('Unable to downvote comment');

  new responseHandler(res, downvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  getComment,
  getComments,
  createComment,
  updateComment,
  upvoteComment,
  downvoteComment,
};
