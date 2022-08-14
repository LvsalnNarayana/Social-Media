import { Server } from "socket.io";
import { store } from "./SessionMiddleware.js";
import { sessionMiddleware } from "./SessionMiddleware.js";
import { set_socket_server_instance } from "./serverStore.js";
import disconnectHanlder from "../socketHandlers/disconnectHandler.js";
import newConnectionHandler from "../socketHandlers/newConnectionHnadler.js";
//imports
import { Auth_Handler } from "../socketHandlers/auth_handler.js";
import { User_Handler } from "../socketHandlers/user_handler.js";
import { Post_Handler } from "../socketHandlers/post_handler.js";
import { Message_Handler } from "../socketHandlers/message_handdler.js";

const registerSocketServer = (server, session_id) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        },
        cookie: false,
        credentials: true
    });
    set_socket_server_instance(io);
    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });
    io.use((socket, next) => {
        var cookies = socket.request.headers.cookie;
        let cookie_obj = {}
        cookies?.split(';').map((data) => {
            cookie_obj[data.trim().split('=')[0]] = data.trim().split('=')[1]
        });
        if (cookie_obj['new2'] !== null && cookie_obj['new2'] !== undefined) {
            session_id = cookie_obj['new2'].split('.')[0].substring(4);
            if (socket.request.session.id === session_id) {
                store.get(session_id, (err, data) => {
                    if (data === null && data === undefined) {
                        return next(new Error('session not found'))
                    } else {
                        if (data.cookie.expires.getTime() > new Date().getTime()) {
                            socket.request.session.socket = socket.id;
                            socket.request.session.save()
                            return next()
                        } else {
                            return next(new Error('Session Expired. Please Login Again.'))
                        }
                    }
                });
            } else {
                var err = new Error('session not found');
                return next(err)
            }
        } else {
            var err = new Error('session not found');
            return next(err)
        }
    });
    io.on('connection', (socket) => {
        newConnectionHandler(socket, io);
        var Auth_handler = new Auth_Handler(socket, io);
        var User_handler = new User_Handler(socket, io);
        var Post_handler = new Post_Handler(socket, io);
        var Message_handler = new Message_Handler(socket, io);
        const socket_id = socket.request?.session?.socket;
        const user_id = socket.request?.session?.user?.id;
        if (socket.request?.session?.user !== null) {
            User_handler.POST_active_friends(socket_id)
        }
        socket.on('GET_auth_status_request', () => {
            Auth_handler.GET_auth_status(socket_id);
        });

        socket.on('POST_login_request', (data) => {
            Auth_handler.POST_user_login(socket_id, data);
        });

        socket.on('GET_profile_request', () => {
            User_handler.GET_user_profile(socket_id);
        });

        socket.on('GET_search_user_request', (username) => {
            User_handler.GET_search_user(socket_id, username);
        });

        socket.on('GET_search_user_profile_request', (username) => {
            User_handler.GET_search_user_profile(socket_id, user_id, username);
        });

        socket.on('GET_friend_invitations_request', () => {
            User_handler.GET_friend_invitations(socket_id, user_id);
        });

        socket.on('POST_invitation_request', (receiver) => {
            User_handler.POST_invitation(socket_id, receiver);
        });

        socket.on('POST_accept_invitation_request', (sender_id) => {
            User_handler.POST_accept_invitation(socket_id, sender_id);
        });

        socket.on('POST_reject_invitation_request', (sender_id) => {
            User_handler.POST_reject_invitation(socket_id, sender_id);
        });

        socket.on('GET_active_friends_request', () => {
            User_handler.GET_active_friends(socket_id, user_id)
        });

        socket.on('GET_posts_request', () => {
            Post_handler.GET_posts(socket_id, user_id)
        });

        // socket.on('GET_user_posts_request', (author_id) => {
        //     Post_handler.GET_user_posts(socket_id, author_id)
        // });

        socket.on('POST_create_post_request', (data) => {
            Post_handler.POST_create_post(socket_id, data)
        });

        socket.on('POST_send_message_request', (data) => {
            Message_handler.POST_send_message(socket_id, user_id, data.receiver_id, data.message)
        });

        socket.on('GET_messages_request', (receiver_id) => {
            Message_handler.GET_messages(socket_id, receiver_id)
        });

        socket.on('GET_user_messages_request', (receiver_id) => {
            Message_handler.GET_user_messages(socket_id, user_id, receiver_id)
        });

        socket.on('disconnect', () => {
            User_handler.POST_active_friends(socket_id)
            disconnectHanlder(socket)
        });
    });
}
export default registerSocketServer