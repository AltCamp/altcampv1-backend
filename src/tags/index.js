const router = require('express').Router();
const TagsController = require('./tagsController');
const { authEmailIsVerified } = require('../../middleware/authenticate');
const TagsValidator = require('./tagsValidator');
const validatorMiddleware = require('../../middleware/validator');
const { validator } = require('../common');
const limiter = require('../../middleware/rateLimit');

const tagsController = new TagsController();

router.use(authEmailIsVerified);
router
  .route('/')
  .get(validator.query(TagsValidator.validateTags()), tagsController.getTags)
  .post(
    limiter(),
    validatorMiddleware(TagsValidator.validateCreateTags()),
    tagsController.createTags
  );

module.exports = router;
