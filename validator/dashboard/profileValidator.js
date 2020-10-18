const {
    body
} = require('express-validator');
const validator = require('validator')


const linkValidator = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please Provide Valid Url')
        }
    }

    return true;
};

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name Can not Be Empty')
        .isLength({
            max: 50
        }).withMessage('Name can not be more than 50 character')
        .trim(),
    body('title')
        .not().isEmpty().withMessage('Title Can not Be Empty')
        .isLength({
            max: 100
        }).withMessage('Title Can not Be More Than 100 Characers')
        .trim(),
    body('bio')
        .not().isEmpty().withMessage('Bio Can not Be Empty')
        .isLength({
            max: 500
        }).withMessage('Bio Can not Be More Than 500 Characters')
        .trim(),
    body('website')
        .custom(linkValidator),
    body('facebook')
        .custom(linkValidator),
    body('github')
        .custom(linkValidator),
    body('linkedin')
        .custom(linkValidator)
];