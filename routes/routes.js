const authRoute = require('./authRout');
const dashboardRoute = require('./dashboardRout');
const Flash = require('../utils/Flash');
const uploadRoute = require('./uploadRoutes');
const postRoute = require('./postRoute');

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
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/',
        handler: (req, res) => {

            res.render('pages/auth/signup', {
                title: 'Create A New Account',
                flashMessage: Flash.getMessage(req),
                error: {},
                value: {}
            })
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