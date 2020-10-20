//title, body, author, tags, thumbnail, readTime, likes, dislikes, comments

const {
    Schema,
    model
} = require('mongoose');

//const User = require('./User');
const Comments = require('./Comments');

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        maxlength: 5000
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    thumbnail: String,
    readTime: String,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: Comments
    }]
}, {
    timestamps: true
});

postSchema.index({
    title: 'text',
    body: 'text',
    tags: 'text'
},{
    weights: {
        title: 5,
        tags: 4,
        body: 3
    }
})

const Post = model('Post', postSchema);

module.exports = Post;