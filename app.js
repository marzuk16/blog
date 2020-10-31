require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const favicon = require('serve-favicon');

const Flash = require('./utils/Flash');

const setMiddleware = require('./middleware/middleware');
const setRoutes = require('./routes/routes');


const PORT = process.env.PORT || 3000;
const dbUser = config.get('db-username');
const dbUserPass = config.get('db-password');
const dbName = 'blog';
const mongoDBUrl = `mongodb+srv://${dbUser}:${dbUserPass}@cluster0.arzvi.mongodb.net/${dbName}?retryWrites=true&w=majority`;


const app = express();
console.log(config.get('name'));

//setup view Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//using middleware from middleware directory
setMiddleware(app);

//using routes from route directory
setRoutes(app);

app.use((req, res, next) => {
    let error = new Error('404 Page Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if(error.status === 404){
        //console.log(error);
        return res.render('pages/error/404', { flashMessage: {} });
    }
    console.log(error);
    res.render('pages/error/500', { flashMessage: {} });
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