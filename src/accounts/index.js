const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const { uploadProfilePicture, deleteAccount } = require('./accountsController');
const multer = require('multer');
const { deleteAccountValidator } = require('./accountsValidator');
const upload = multer({ dest: 'src/accounts/tmp/uploads/' });
const validatorMiddleware = require('../../middleware/validator');
router.use(verifyUser);
const {
  getAccount,
  getAccounts,
  updateAccount,
  uploadProfilePicture,
} = require('./accountsController');
const multer = require('multer');
const {
  getAccountsValidator,
  profileBioValidator,
  profileValidator,
} = require('./accountsValidator');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const validatorMiddleware = require('../../middleware/validator');

router
  .route('/')
  .get(validator.query(getAccountsValidator), getAccounts)
  .put(verifyUser, validatorMiddleware(profileValidator), updateAccount);

router
  .route('/bio')
  .put(verifyUser, validatorMiddleware(profileBioValidator), updateAccount);

router
  .route('/upload-profile-picture')
  .put(verifyUser, upload.single('profilePicture'), uploadProfilePicture);

router.route('/:id').get(getAccount);

router.delete(
  '/delete-account',
  validatorMiddleware(deleteAccountValidator),
  deleteAccount
);

module.exports = router;
