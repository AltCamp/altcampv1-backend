const router = require('express').Router();
const questions = require('./questions.controller');
const { verifyUser } = require('../../middleware/authenticate');
const {
  updateQuestionValidator,
  createQuestionValidator,
} = require('./questions.validator');

router
  .route('/')
  .get(questions.getAllQuestions)
  .post(verifyUser, createQuestionValidator, questions.createQuestion);

router
  .route('/:id')
  .get(questions.getQuestion)
  .patch(verifyUser, updateQuestionValidator, questions.updateQuestion)
  .delete(verifyUser, questions.deleteQuestion);

module.exports = router;
