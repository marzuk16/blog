const { body } = require('express-validator');
const cheerio = require('cheerio');

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Please Provide Post Title')
        .isLength({ max: 100 }).withMessage('Title Can not Be More Than 100 Characters')
        .trim(),
    body('body')
        .not().isEmpty().withMessage('Please Provide Post Body')
        .custom(value => {
            let node = cheerio.load(value);
            let text = node.text();

            if(text.length > 5000){
                throw new Error('Body Can not Be More Than 5000 Characters');
            }

            return true;
        }),
    body('tags')
        .not().isEmpty().withMessage('Please provide a post tags.')
];