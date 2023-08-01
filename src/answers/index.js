const router = require('express').Router();
const {
  authEmailIsVerified,
  authOptional,
} = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const {
  createAnswerValidator,
  getAnswerValidator,
  getAnswersValidator,
  updateAnswerValidator,
} = require('./answersValidator');
const answers = require('./answersController');
const limiter = require('../../middleware/rateLimit');

router
  .route('/')
  .get(authOptional, validator.query(getAnswersValidator), answers.getAnswers)
  .post(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(createAnswerValidator),
    answers.createAnswer
  );

router.route('/upvote/:id').patch(authEmailIsVerified, answers.upvoteAnswer);

router
  .route('/downvote/:id')
  .patch(authEmailIsVerified, answers.downvoteAnswer);

router
  .route('/:id')
  .get(authOptional, validator.params(getAnswerValidator), answers.getAnswer)
  .patch(
    limiter(),
    authEmailIsVerified,
    validatorMiddleware(updateAnswerValidator),
    answers.updateAnswer
  );

module.exports = router;
