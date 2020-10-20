const Profile = require('../../models/Profile');

exports.bookmarksGetController = async (req, res, next) => {
    let { postId } = req.params;

    if (!req.user) {
        return res.status(403).json({
            error: 'Please login first'
        })
    }

    let userId = req.user._id;
    let bookmark = null;

    try {
        let profie = await Profile.findOne({
            user: userId
        });

        if(profie.bookmarks.includes(postId)){
            await Profile.findOneAndUpdate(
                { user: userId },
                { $pull: {'bookmarks': postId }}
            );
            bookmarks = false;
        }else{
            await Profile.findOneAndUpdate(
                {user: userId},
                { $push: {'bookmarks': postId } }
            );
            bookmark = true;
        }

        res.status(200).json({
            bookmark
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'SERVER ERROR OCCURRED'
        });
    }
};