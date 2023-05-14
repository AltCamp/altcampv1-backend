const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const {
  createAnswerValidator,
  updateAnswerValidator,
} = require('./answersValidator');
const answers = require('./answersController');

router.use(verifyUser);
router
  .route('/')
  .post(validatorMiddleware(createAnswerValidator), answers.createAnswer);

router.route('/upvote/:id').patch(answers.upvoteAnswer);

router.route('/downvote/:id').patch(answers.downvoteAnswer);

router
  .route('/:id')
  .patch(validatorMiddleware(updateAnswerValidator), answers.updateAnswer);

module.exports = router;
