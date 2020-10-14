const { body } = require('express-validator');

const User = require('../../models/User');

module.exports = [
    body('username')
        .isLength({min: 2})
        .withMessage('username muste be geater than 2 character')
        .custom( async username => {
            let user = await User.findOne({username});
            if(user){
                return Promise.reject('User name already taken')
            }
        })
        .trim(),
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .custom( async email => {
            let user = await User.findOne({email});
            if(user){
                return Promise.reject('Email already used')
            }
        })
        .normalizeEmail(),
    body('password')
        .isLength({min: 5}).withMessage('Password must be min 5 charcter'),
    body('confirmPassword')
    
        .isLength({min: 5}).withMessage('Password must be min 5 charcter')
        .custom( (confirmPassword, {req}) => {
            if(confirmPassword !== req.body.password){
                throw new Error('password does not match')
            }
            return true;
        })
];