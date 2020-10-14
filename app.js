require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const Flash = require('./utils/Flash');

const mongoDBStore = require('connect-mongodb-session')(session);

//import routes
const authRoutes = require('./routes/authRout');
const dashboardRoutes = require('./routes/dashboardRout');

//import middleware
const {
    bindUserWithRequest
} = require('./middleware/authMiddleware');
const setLocals = require('./middleware/setLocals');

const PORT = process.env.PORT || 3000;
const dbUser = process.env.dbUser
const dbUserPass = process.env.dbUserPass
const dbName = 'blog';
const mongoDBUrl = `mongodb+srv://${dbUser}:${dbUserPass}@cluster0.arzvi.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const store = new mongoDBStore({
    uri: mongoDBUrl,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});

const app = express();

if(app.get('env').toLowerCase() === 'development'){
    app.use(morgan('dev'));
}

//setup view Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Middleware array
const middleware = [
    express.static('public'),
    express.urlencoded({
        extended: true
    }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
    bindUserWithRequest(),
    setLocals(),
    flash()
];

app.use(middleware);

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {

    res.render('pages/auth/signup', {
        title: 'Create A New Account',
        flashMessage: Flash.getMessage(req),
        error: {},
        value: {}
    });
});


mongoose.connect(mongoDBUrl, {
        useNewUrlParser: true
    })
    .then(() => {
        //console.log(`Database connected`);
        app.listen(PORT, () => {
            console.log(`SERVER IS RUNNING ON ${PORT}`);
        });
    })
    .catch(error => {
        return console.log(error);
    })