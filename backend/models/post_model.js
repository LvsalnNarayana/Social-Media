//________  require mongoose  ________// 
import mongoose from 'mongoose'

//________  schema  ________// 
const schema = mongoose.Schema;

//________  user schema  ________// 
const post_schema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post_type: {
        type: String,
        default: 'Public',
        required: true
    },
    post_desc: {
        type: String
    },
    post_likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post_shares: {
        type: Number,
        default: 0
    },
    post_comments: [{
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        user_comment: {
            type: String
        }
    }],
}, {
    timestamps: true
});

post_schema.statics.GET_FRIENDS_POSTS = (user_ids) => {
    const posts = Post.aggregate([
        {
            $match: {
                user: { $in: user_ids },
                post_type: {
                    $in: ['public', 'friends']
                }
            }
        }
    ]);
    return posts
}
post_schema.statics.GET_POSTS = (user_id) => {
    const posts = Post.aggregate([
        {
            $match: {
                user: user_id,
            }
        }
    ]);
    return posts
}

//create mongoose model
const Post = mongoose.model('Post', post_schema);
export default Post;
