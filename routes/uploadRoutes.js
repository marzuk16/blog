const router = require('express').Router();

const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware//uploadMiddleware');

const {
    uploadProfilePics
} = require('../controllers/uploadController');

router.post(
    '/profilePics', 
    isAuthenticated,
    upload.single('profilePics'), // profilePics is a field name from html name property
    uploadProfilePics
);

module.exports = router;