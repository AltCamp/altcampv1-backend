const router = require('express').Router();
const questions = require('./questionsController');
const {
  authEmailIsVerified,
  authOptional,
} = require('../../middleware/authenticate');
const {
  createQuestionValidator,
  updateQuestionValidator,
} = require('./questionsValidator');
const validatorMiddleware = require('../../middleware/validator');
const { paginationSchema, validator } = require('../common');
const limiter = require('../../middleware/rateLimit');

router
  .route('/')
  .get(
    authOptional,
    validator.query(paginationSchema),
    questions.getAllQuestions
  )
  .post(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(createQuestionValidator),
    questions.createQuestion
  );

router
  .route('/:id')
  .get(authOptional, questions.getQuestion)
  .patch(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(updateQuestionValidator),
    questions.updateQuestion
  )
  .delete(authEmailIsVerified, questions.deleteQuestion);

router
  .route('/:id/upvote')
  .patch(authEmailIsVerified, questions.upvoteQuestion);

router
  .route('/:id/downvote')
  .patch(authEmailIsVerified, questions.downvoteQuestion);

module.exports = router;
