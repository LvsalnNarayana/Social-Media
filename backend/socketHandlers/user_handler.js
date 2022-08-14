import User from '../models/user_model.js';
import { Post_Handler } from './post_handler.js';
import Request from '../models/request_model.js';
import asyncHandler from 'express-async-handler';
import { GetUserSockets } from '../utils/serverStore.js';
import { Get_User_By_Socket } from '../utils/serverStore.js';
import { set_session_storage } from '../utils/serverStore.js';

export class User_Handler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.UserId = this.socket.request?.session?.user?.id;
        this.session = this.socket.request?.session
        this.Post_handler = new Post_Handler(this.socket, this.io);
    }
    GET_user_profile = asyncHandler(async (socket_id) => {
        const user = await User.GET_USER_BY_ID(this.UserId);
        if ((user !== null || user !== undefined) && user.length > 0) {
            this.GET_active_friends(socket_id, this.UserId);
            this.Post_handler.GET_posts(socket_id, this.UserId)
            set_session_storage(this.session, 'user', user[0]);
            this.io.to(socket_id).emit('GET_user_profile_response', {
                user: user[0],
            });
        }
    });

    GET_search_user = asyncHandler(async (socket_id, username) => {
        const users = await User.SEARCH_BY_USERNAME(username);
        this.io.to(socket_id).emit('GET_search_user_response', users);
    });

    GET_search_user_profile = asyncHandler(async (socket_id, user_id, username) => {
        if (username === this.socket.request.session?.user?.username && this.socket.request.session?.socket === socket_id) {
            const user = await User.GET_PROFILE(user_id, username.toLowerCase(), true);
            var emit_user = {
                user: user[0],
                connected_user: true
            }
            this.io.to(socket_id).emit('GET_search_user_profile_response', emit_user);
        } else {
            const user = await User.GET_PROFILE(user_id, username.toLowerCase(), false);
            var emit_user = {
                user: user[0],
                connected_user: false
            }
            this.io.to(socket_id).emit('GET_search_user_profile_response', emit_user);
        }
    });

    GET_friend_invitations = asyncHandler(async (socket_id, user_id) => {
        const invitations = await Request.find({ receiver_id: user_id }).populate('sender_id', 'username').select('-_id');
        this.io.to(socket_id).emit('GET_friend_invitations_response', invitations);
    });

    POST_invitation = asyncHandler(async (socket_id, receiver) => {
        const check_invitation = await Request.findOne({ receiver_id: receiver.receiver_id, sender_id: this.UserId });
        const receiver_sockets = GetUserSockets(receiver.receiver_id);
        if (check_invitation === null || check_invitation === undefined) {
            const invitation = await Request.create({ receiver_id: receiver.receiver_id, sender_id: this.UserId });
            if (receiver_sockets.length > 0 && invitation !== null) {
                const receiver_invitations = await Request.find({ receiver_id: receiver.receiver_id }).populate('sender_id', 'username').select('-_id');
                receiver_sockets.forEach((data) => {
                    this.io.to(data).emit('GET_friend_invitations_response', receiver_invitations);
                })
            }
            this.GET_search_user_profile(socket_id, this.UserId, receiver.username)
        }
    });

    POST_accept_invitation = asyncHandler(async (socket_id, sender_id) => {
        await User.UPDATE_FRIEND(this.UserId, sender_id);
        await User.UPDATE_FRIEND(sender_id, this.UserId);
        await Request.findOneAndDelete({ sender_id: this.UserId, receiver_id: sender_id });
        const invitation = await Request.findOneAndDelete({ receiver_id: this.UserId, sender_id: sender_id }).populate('receiver_id', 'username');
        this.GET_friend_invitations(socket_id, this.UserId)
        this.GET_user_profile(socket_id)
        const receiver_sockets = GetUserSockets(invitation.sender_id.toString());
        if ((receiver_sockets !== null || receiver_sockets !== undefined) && receiver_sockets.length > 0) {
            receiver_sockets.forEach((socket) => {
                this.GET_search_user_profile(socket, invitation.sender_id.toString(), invitation.receiver_id.username);
            })
        }
    });

    POST_reject_invitation = asyncHandler(async (socket_id, sender_id) => {
        const invitation = await Request.findOneAndDelete({ receiver_id: this.UserId, sender_id: sender_id }).populate('receiver_id sender_id', 'username').select('-_id');
        this.GET_friend_invitations(this.UserId)
        const receiver_sockets = GetUserSockets(invitation.sender_id.toString());
        if ((receiver_sockets !== null || receiver_sockets !== undefined) && receiver_sockets.length > 0) {
            receiver_sockets.forEach((socket) => {
                this.GET_search_user_profile(socket, invitation.sender_id.toString(), invitation.receiver_id.username);
            })
        }
    });

    GET_active_friends = asyncHandler(async (socket_id, user_id) => {
        const active_friends = [];
        const friends = await User.GET_FRIENDS(user_id);
        friends?.friends?.forEach((friend) => {
            const receiver_sockets = GetUserSockets(friend.friend_id.toString());
            if ((receiver_sockets !== null || receiver_sockets !== undefined) && receiver_sockets.length > 0) {
                active_friends.push(friend.friend_id);
            }
        });
        const active_friends_data = await User.GET_ACTIVE_FRIENDS(active_friends);
        this.io.to(socket_id).emit('GET_active_friends_response', active_friends_data);
    });

    POST_active_friends = asyncHandler(async (socket_id) => {
        const friends = await User.GET_FRIENDS(this.UserId);
        friends?.friends?.forEach((friend) => {
            const receiver_sockets = GetUserSockets(friend.friend_id.toString());
            if ((receiver_sockets !== null || receiver_sockets !== undefined) && receiver_sockets.length > 0) {
                receiver_sockets.forEach((socket) => {
                    if (socket_id !== socket) {
                        this.GET_active_friends(socket, Get_User_By_Socket(socket))
                    }
                })
            }
        });
    })
}