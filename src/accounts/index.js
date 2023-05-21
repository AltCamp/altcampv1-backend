const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const { uploadProfilePicture } = require('./accountsController');
const multer = require('multer');

const upload = multer({ dest: 'src/accounts/tmp/uploads/' });

router.use(verifyUser);
router
  .route('/upload-profile-picture')
  .put(upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
