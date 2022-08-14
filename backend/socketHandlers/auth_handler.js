import asyncHandler from 'express-async-handler';
import User from './../models/user_model.js';
import match_password from './../utils/match_password.js';
import { set_session_storage } from '../utils/serverStore.js';
import { User_Handler } from './user_handler.js';

export class Auth_Handler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.UserId = this.socket.request?.session?.user?.id;
        this.session = this.socket.request?.session;
        this.User_handler = new User_Handler(this.socket, this.io);
    }

    GET_auth_status = async (socket_id) => {
        if (this.socket.request.session?.user === null || this.socket.request.session?.user === undefined) {
            this.io.to(socket_id).emit('GET_auth_status_response', {
                auth_status: false,
            })
        }
        else {
            this.io.to(socket_id).emit('GET_auth_status_response', {
                auth_status: true,
            })
        }
    }

    POST_user_login = asyncHandler(async (socket_id, data) => {
        const { username, password } = data;
        const user = await User.GET_USER_BY_USERNAME(username);
        if (user !== null && (await match_password(password, user[0].password))) {
            delete user[0].password
            set_session_storage(this.session, 'user', user[0]);
            this.io.to(socket_id).emit('POST_login_response', {
                message: 'User Logged in..!',
                status: 200
            });
            this.io.to(socket_id).emit('GET_auth_status_response', {
                auth_status: true
            });
            const friends = await User.GET_FRIENDS(this.UserId);
            friends?.friends?.forEach((friend) => {
                const receiver_sockets = GetUserSockets(friend.friend_id.toString());
                if ((receiver_sockets !== null || receiver_sockets !== undefined) && receiver_sockets.length > 0) {
                    receiver_sockets.forEach((socket) => {
                        this.User_handler.GET_active_friends(socket)
                    })
                }
            });
        }
        else if (user === null) {
            this.io.to(socket_id).emit('POST_login_response', {
                message: 'User not found..!',
                status: 404
            });
            this.io.to(socket_id).emit('GET_auth_status_response', {
                auth_status: false
            });
        } else {
            this.io.to(socket_id).emit('POST_login_response', {
                message: 'Username or Password Incorrect..!',
                status: 401
            });
            this.io.to(socket_id).emit('GET_auth_status_response', {
                auth_status: false
            });
        }
    })
}