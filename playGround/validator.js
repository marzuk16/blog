const router = require('express').Router();
const { check } = require('express-validator');

router.get('/validator', (req, res, next) => {
    res.render('playGround/signup', { title: 'validator playground'} );
});
router.post('/validator', (req, res, next) => {

});

module.exports = router;