const {
    validationResult
} = require('express-validator');
const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const errorFormatter = require('../utils/validationErrorFormatter');
const User = require('../models/User');
const Comment = require('../models/Comments');

exports.dashboardGetController = async (req, res, next) => {

    try {
        let profile = await Profile.findOne({
            user: req.user._id
        });
        if (profile) {
            return res.render('pages/dashboard/dashboard', {
                title: 'My Dashboard',
                flashMessage: Flash.getMessage(req)
            });
        }

        res.redirect('/dashboard/create-profile');

    } catch (e) {
        next(e);
    }
};

exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({
            user: req.user._id
        });
        if (profile) {
            return res.redirect('/dashboard/edit-profile');
        }

        res.render('pages/dashboard/create-profile', {
            title: 'create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: {}
        });

    } catch (e) {
        next(e);
    }
};

exports.createProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile', {
            title: 'create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped()
        });
    }

    let {
        name,
        title,
        bio,
        website,
        facebook,
        github,
        linkedin
    } = req.body;

    try {
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                github: github || '',
                linkedin: linkedin || ''
            },
            posts: [],
            bookmarks: []
        });

        let createdProfile = await profile.save();
        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: {
                profile: createdProfile._id
            }
        });

        req.flash('success', 'Profile Created Successfully');

        res.redirect('/dashboard');

    } catch (e) {
        next(e);
    }
};

exports.editProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({
            user: req.user._id
        });
        if (!profile) {
            return res.redirect('/dashboard/create-profile');
        }

        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            error: {},
            flashMessage: Flash.getMessage(req),
            profile
        });

    } catch (e) {
        next(e);
    }
};

exports.editProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    let {
        name,
        title,
        bio,
        website,
        facebook,
        github,
        linkedin
    } = req.body;

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile', {
            title: 'create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            profile: {
                name,
                title,
                bio,
                links: {
                    website,
                    facebook,
                    github,
                    linkedin
                }
            }
        });
    }
    
    try {
        let profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                github: github || '',
                linkedin: linkedin || ''
            }
        };

        let updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profile },
            { new: true }
        );
        
        req.flash('success', 'Profile Updated Successfully');
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            error: {},
            flashMessage: Flash.getMessage(req),
            profile: updatedProfile
        });

    } catch (e) {
        next(e);
    }
};

exports.bookmarksGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({user: req.user._id})
            .populate({
                path: 'bookmarks',
                model: 'Post',
                selct: 'title thumbnail'
            })
        res.render('pages/dashboard/bookmarks', {
            title: 'My bookmarks',
            flashMessage: Flash.getMessage(req),
            posts: profile.bookmarks
        })

    } catch (e) {
        next(e);
    }
};

exports.commentsGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id });
        let comments = await Comment.find({ post: {$in: profile.posts} })
            .populate({
                path: 'post',
                select: 'title'
            })
            .populate({
                path: 'user',
                select: 'username profilePics'
            })
            .populate({
                path: 'replies.user',
                select: 'username profilePics'
            })

        res.render('pages/dashboard/comments', {
            title: 'My Recent Comments',
            flashMessage: Flash.getMessage(req),
            comments
        })
    } catch (e) {
        next(e);
    }
};