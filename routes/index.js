const express = require('express');
const router = express.Router();
const authRouter = require('../src/auth');
const accountRouter = require('../src/accounts');
const apiDocs = require('../src/docs');
const questionsRouter = require('../src/questions');
const answersRouter = require('../src/answers');
const postsRouter = require('../src/posts');
const commentsRouter = require('../src/comments');
const bookmarksRouter = require('../src/bookmarks');

router.use('/auth', authRouter);
router.use('/accounts', accountRouter);
router.use('/questions', questionsRouter);
router.use('/posts', postsRouter);
router.use('/answers', answersRouter);
router.use('/comments', commentsRouter);
router.use('/bookmarks', bookmarksRouter);
router.use('/api-docs', apiDocs);

module.exports = router;
