const authRoute = require('./authRout');
const dashboardRoute = require('./dashboardRout');
const Flash = require('../utils/Flash');
const uploadRoute = require('./uploadRoutes');
const postRoute = require('./postRoute');
const explorerRoute = require('./exploreRoute');
const searchRoute = require('./searchRoute');
const authorRoute = require('./authorRoute');

const apiRoutes = require('../api/routes/apiRoutes');

const routes = [{
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboardRoute
    },
    {
        path:'/posts',
        handler: postRoute
    },
    {
        path: '/explorer',
        handler: explorerRoute
    },
    {
        path: '/search',
        handler: searchRoute
    },
    {
        path: '/author',
        handler: authorRoute
    },
    {
        path: '/api',
        handler: apiRoutes
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/',
        handler: (req, res) => {

            res.redirect('/explorer');
        }
    }
];

module.exports = (app) => {
    routes.forEach(r => {
        if(r.path === '/'){
            app.get(r.path, r.handler);
        }else{
            app.use(r.path, r.handler);
        }
    });
};