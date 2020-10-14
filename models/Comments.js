// postId, userId, body, replise[]

const {
    Schema,
    model,
    models
} = require('mongoose');

/* const User = require('./User');
const Post = require('./Post'); */

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true,
    },
    replies: [{
        body: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createAt: {
            type: Date,
            default: new Date()
        }
    }]
}, {
    timestamps: true
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;