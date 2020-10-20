const bcrypt = require('bcrypt');
const {
    validationResult
} = require('express-validator')

const Flash = require('../utils/Flash');

const User = require('../models/User');
const errorFormatter = require('../utils/validationErrorFormatter');

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup', {
        title: 'Create A New Account',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req)
    });
};
exports.signupPostController = async (req, res, next) => {

    let {
        username,
        email,
        password
    } = req.body;

    //console.log(req.body);

    let errors = validationResult(req).formatWith(errorFormatter);
    
    if (!errors.isEmpty()) {
        //return console.log(errors.mapped());
        req.flash('fail', 'Please check your Form');
        return res.render('pages/auth/signup', {
            title: 'Create A New Account',
            error: errors.mapped(),
            value: {
                username,
                email,
                password
            },
            flashMessage: Flash.getMessage(req)

        });
    }

    try {

        let hashedPassword = await bcrypt.hash(password, 12);

        let user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        //console.log('User created successfully', createdUser);
        req.flash('success', 'User Created Successfully');
        res.redirect('/auth/login');

    } catch (error) {
        console.log(errr);
        next(error);
    }
};
exports.loginGetController = (req, res, next) => {
    //let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false;
    res.render('pages/auth/login', {
        title: 'Login To Your Account',
        error: {},
        flashMessage: Flash.getMessage(req)
    });
};
exports.loginPostController = async (req, res, next) => {
    let {
        email,
        password
    } = req.body;

    //let isLoggedIn = req.get('Cookie').includes('isLoggedIn = true') ? true : false;


    let errors = validationResult(req).formatWith(errorFormatter);
    
    if (!errors.isEmpty()) {
        //return console.log(errors.mapped());

        req.flash('fail', 'Please Check Your Form');
        return res.render('pages/auth/login', {
            title: 'Login To Your Account',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        });
    }

    try {
        let user = await User.findOne({
            email
        });
        //console.log(user);
        if (!user) {
            req.flash('fail', 'Invalid Credetials');
            return res.render('pages/auth/login', {
                title: 'Login To Your Account',
                error: {},
                flashMessage: Flash.getMessage(req)
            });
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash('fail', 'Invalid Credentials');
            return res.render('pages/auth/login', {
                title: 'Login To Your Account',
                error: {},
                flashMessage: Flash.getMessage(req),
            });
        }

        //res.setHeader('Set-Cookie', 'isLoggedIn = true'); // for create cookies
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(error => {
            if (error) {
                console.log(error);
                return next();
            }
            req.flash('success', 'Successfully Logged In');
            res.redirect('/dashboard');
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
exports.logoutController = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            return next();
        }
        res.redirect('/auth/login');
    });
};

exports.changePasswordGetController = async (req, res, next) => {
    res.render('pages/auth/changePassword', {
        title: 'Change Password',
        flashMessage: Flash.getMessage(req)
    })
};
exports.changePasswordPostController = async (req, res, next) => {
    
    let {
        oldPassword,
        newPassword,
        confirmPassword
    } = req.body;
    
    if(newPassword !== confirmPassword){
        req.flash('fail', 'Password does not match');
        return res.redirect('/auth/change-password');
    }

    try {
        let match = await bcrypt.compare(oldPassword, req.user.password);

        if(!match){
            req.flash('fail', 'Please provide a correct old password');
            return res.redirect('/auth/change-password');
        }
    
        let hash = await bcrypt.hash(newPassword, 12);

        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {password: hash }}
        );

        req.flash('success', 'Password updated successfully');
        return res.redirect('/auth/change-password');

    } catch (e) {
        next(e);
    }
};