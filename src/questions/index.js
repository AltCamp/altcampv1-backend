const router = require('express').Router();
const questions = require('./questions.controller');
const { verifyUser } = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const answers = require('../answers/answers.controller');

router.use(verifyUser);
router
  .route('/')
  .get(questions.getAllQuestions)
  .post(
    validatorMiddleware('createQuestionValidator'),
    questions.createQuestion
  );

router
  .route('/:id')
  .get(questions.getQuestion)
  .patch(
    validatorMiddleware('updateQuestionValidator'),
    questions.updateQuestion
  )
  .delete(verifyUser, questions.deleteQuestion);

router.route('/:id/upvote').patch(questions.upvoteQuestion);

router.route('/:id/downvote').patch(questions.downvoteQuestion);

// answers to questions route
router.route('/:questionId/answers').post(answers.createAnswer);
router.route('/:questionId/answers').get(answers.getAnswers);
router.route('/:questionId/answers/:answerId').patch(answers.updateAnswer);
router
  .route('/:questionId/answers/upvote/:answerId')
  .patch(answers.upvoteAnswer);
router
  .route('/:questionId/answers/downvote/:answerId')
  .patch(answers.downvoteAnswer);

module.exports = router;
