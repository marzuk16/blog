const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');

const {
    dashboardGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGettController,
    editProfilePostController
} = require('../controllers/dashboardController');
const Profile = require('../models/Profile');

router.get('/', isAuthenticated, dashboardGetController);

router.get('/create-profile', isAuthenticated, createProfileGetController);   
router.post('/create-profile', isAuthenticated, createProfilePostController);   

router.get('/edit-profile', isAuthenticated, editProfileGettController);
router.post('/edit-profile', isAuthenticated, editProfilePostController);

module.exports = router;