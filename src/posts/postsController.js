const mongoose = require('mongoose');
const postsService = require('./postsService');
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE, MediaProviders } = require('../../constant');
const TagsService = require('../tags/tagsService');
const MediaServiceFactory = require('../common/media');
const tagsService = new TagsService();

const getPost = async (req, res) => {
  const postId = req.params.id;

  const post = await postsService.getPost(postId, { userId: req.user?._id });

  if (!post) throw new NotFoundError('Not Found');

  new responseHandler(res, post, 200, RESPONSE_MESSAGE.SUCCESS);
};

const getAllPosts = async (req, res) => {
  const { tags } = req.query;
  if (tags) {
    const tagNames = tags.split(',').map((tag) => tag.trim());
    const tagIds = await tagsService._getTagId(tagNames);
    req.query.tags = tagIds;
  }

  const { data, meta } = await postsService.getPosts(req, {
    userId: req.user?._id,
  });
  new responseHandler(res, data, 200, RESPONSE_MESSAGE.SUCCESS, meta);
};

const createPost = async (req, res) => {
  let media;
  let { tags, ...content } = req.body;
  const user = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (tags) {
      const tagsInDb = await tagsService.createTags(tags, user, session);
      tags = tagsInDb.map(({ _id }) => _id);
    }

    if (req.files) {
      const mediaService = MediaServiceFactory.getService(
        MediaProviders.CLOUDINARY
      );
      const mediaInDb = await Promise.all(
        req.files.map((file) => {
          return mediaService.saveMedia(
            {
              media: file,
              owner: req.user._id,
            },
            session
          );
        })
      );

      media = mediaInDb.map((item) => item._id);
    }

    const newPost = await postsService.createPost(
      {
        ...content,
        tags,
        media,
        author: req.user._id,
      },
      session
    );
    await session.commitTransaction();

    new responseHandler(res, newPost, 201, RESPONSE_MESSAGE.SUCCESS);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;

  const isAuthor = await postsService.isPostAuthor({
    userId: req.user._id,
    postId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  let { tags, ...post } = { ...req.body };
  if (tags) {
    const tagsInDb = await tagsService.createTags(tags);
    tags = tagsInDb.map(({ _id }) => _id);
  }

  const updatedPost = await postsService.updatePost({
    postId,
    post: { ...post, tags },
  });

  if (!updatedPost) throw new NotFoundError('Not Found');

  new responseHandler(res, updatedPost, 200, RESPONSE_MESSAGE.SUCCESS);
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  const isAuthor = await postsService.isPostAuthor({
    userId: req.user._id,
    postId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const deleted = await postsService.deletePost(postId);

  if (!deleted) throw new NotFoundError('Not Found');

  new responseHandler(res, deleted, 200, RESPONSE_MESSAGE.SUCCESS);
};

const upvotePost = async (req, res) => {
  const postId = req.params.id;

  const upvote = await postsService.upvotePost({
    userId: req.user._id,
    postId,
  });

  if (!upvote) throw new BadRequestError('Unable to upvote post');

  new responseHandler(res, upvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  upvotePost,
};
