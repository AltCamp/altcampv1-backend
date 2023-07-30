const router = require('express').Router();
const TagsController = require('./tagsController');
const { authEmailIsVerified } = require('../../middleware/authenticate');
const TagsValidator = require('./tagsValidator');
const { validator } = require('../common');

const tagsController = new TagsController();

router.use(authEmailIsVerified);
router
  .route('/')
  .get(validator.query(TagsValidator.validateTags()), tagsController.getTags);

module.exports = router;
