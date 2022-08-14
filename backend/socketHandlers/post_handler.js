import asyncHandler from "express-async-handler";
import Post from "../models/post_model.js";
import User from "../models/user_model.js";
import { GetUserSockets } from "../utils/serverStore.js";
import { Get_User_By_Socket } from "../utils/serverStore.js";
export class Post_Handler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.UserId = this.socket.request?.session?.user?.id;
        this.session = this.socket.request?.session;
    }

    GET_posts = asyncHandler(async (socket_id, user_id) => {
        const friend_ids_new = await User.GET_FRIEND_IDS(user_id);
        const all_posts_new = await Post.GET_POSTS(friend_ids_new[0].friend_ids);
        const friends = await User.GET_FRIENDS(user_id);
        const friend_ids = friends?.friends?.map((friend) => {
            return friend.friend_id.toString();
        });
        const all_posts = await Post.find({
            user: { $in: [...friend_ids] },
        }).populate("user");
        const filtered_posts = all_posts.filter((data) => {
            return data.post_type === "friends" || data.post_type === "public";
        });
        const user_posts = await Post.find({ user: this.UserId }).populate("user");
        this.io.to(socket_id).emit(
            "GET_posts_response",
            [...filtered_posts, ...user_posts].sort((a, b) => {
                return b.createdAt - a.createdAt;
            })
        );
        // this.io.to(socket_id).emit(
        //     "GET_posts_response",
        //     all_posts
        // );
    });

    POST_create_post = asyncHandler(async (socket_id, data) => {
        const new_post = {
            user: this.socket.request.session.user.id,
            post_type: data.post_type,
            post_desc: data.post_desc,
        };
        const post = await Post.create(new_post);
        const user_post = await User.findByIdAndUpdate(this.UserId, {
            $push: { posts: { post_id: post?._id } },
        });
        if (
            post !== null &&
            post !== undefined &&
            user_post !== null &&
            user_post !== undefined
        ) {
            this.GET_posts(socket_id, this.UserId);
            this.io.to(socket_id).emit("POST_create_post_response", {
                message: "Post Created..!",
                status: 200,
            });
            const friends = await User.GET_FRIENDS(this.UserId);
            friends?.friends?.forEach((friend) => {
                const receiver_sockets = GetUserSockets(friend.friend_id.toString());
                if (
                    (receiver_sockets !== null || receiver_sockets !== undefined) &&
                    receiver_sockets.length > 0 && (post.post_type === 'public' || post.post_type === 'friends')
                ) {
                    receiver_sockets.forEach((socket) => {
                        console.log(Get_User_By_Socket(socket), socket);
                        this.GET_posts(socket, Get_User_By_Socket(socket));
                    });
                }
            });
        }
    });
    POST_edit_post = asyncHandler(async () => { });
    POST_hide_post = asyncHandler(async () => { });
    POST_delete_post = asyncHandler(async () => { });
}
