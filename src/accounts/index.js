const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const { uploadProfilePicture, deleteAccount } = require('./accountsController');
const multer = require('multer');

const upload = multer({ dest: 'src/accounts/tmp/uploads/' });

router.use(verifyUser);
router
  .route('/upload-profile-picture')
  .put(upload.single('profilePicture'), uploadProfilePicture);

router.route('/delete-account').delete(deleteAccount);

module.exports = router;
