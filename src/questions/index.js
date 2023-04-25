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
router.post('/:questionId/answers', answers.createAnswer);


module.exports = router;
