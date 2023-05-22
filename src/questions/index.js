const router = require('express').Router();
const questions = require('./questionsController');
const { verifyUser } = require('../../middleware/authenticate');
const {
  createQuestionValidator,
  updateQuestionValidator,
} = require('./questionsValidator');
const validatorMiddleware = require('../../middleware/validator');
const limiter = require('../../middleware/rateLimit');

router.use(verifyUser);
router
  .route('/')
  .get(questions.getAllQuestions)
  .post(
    limiter(),
    validatorMiddleware(createQuestionValidator),
    questions.createQuestion
  );

router
  .route('/:id')
  .get(questions.getQuestion)
  .patch(
    limiter(),
    validatorMiddleware(updateQuestionValidator),
    questions.updateQuestion
  )
  .delete(verifyUser, questions.deleteQuestion);

router.route('/:id/upvote').patch(questions.upvoteQuestion);

router.route('/:id/downvote').patch(questions.downvoteQuestion);

module.exports = router;
