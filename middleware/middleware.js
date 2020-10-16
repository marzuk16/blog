const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const mongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');

const { bindUserWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');

const dbUser = config.get('db-username');
const dbUserPass = config.get('db-password');
const dbName = 'blog';
const mongoDBUrl = `mongodb+srv://${dbUser}:${dbUserPass}@cluster0.arzvi.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const store = new mongoDBStore({
    uri: mongoDBUrl,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});


//Middleware array
const middleware = [
    morgan('dev'),
    express.static('public'), // for handle req.body extract
    express.urlencoded({ // for handle req.body extract but cannot extract multi from/file
        extended: true
    }),
    express.json(),
    session({
        secret: config.get('secret'),
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
];

module.exports = app => {
    middleware.forEach( m => {
        app.use(m);
    });
};