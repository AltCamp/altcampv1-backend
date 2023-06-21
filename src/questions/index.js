const router = require('express').Router();
const questions = require('./questionsController');
const { verifyUser } = require('../../middleware/authenticate');
const {
  createQuestionValidator,
  updateQuestionValidator,
} = require('./questionsValidator');
const validatorMiddleware = require('../../middleware/validator');
const { paginationSchema, validator } = require('../common');
const limiter = require('../../middleware/rateLimit');

router
  .route('/')
  .get(validator.query(paginationSchema), questions.getAllQuestions)
  .post(
    limiter(),
    verifyUser,
    validatorMiddleware(createQuestionValidator),
    questions.createQuestion
  );

router
  .route('/:id')
  .get(questions.getQuestion)
  .patch(
    limiter(),
    verifyUser,
    validatorMiddleware(updateQuestionValidator),
    questions.updateQuestion
  )
  .delete(verifyUser, questions.deleteQuestion);

router.route('/:id/upvote').patch(verifyUser, questions.upvoteQuestion);

router.route('/:id/downvote').patch(verifyUser, questions.downvoteQuestion);

module.exports = router;
