const { body } = require('express-validator');

module.exports = [
    body('email')
        .notEmpty().withMessage(`Email can't be empty!`),
    body('password')
        .notEmpty().withMessage(`Password can't be empty!`)
];