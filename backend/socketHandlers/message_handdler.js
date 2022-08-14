import Message from "../models/message_model.js";
import asyncHandler from 'express-async-handler';
import { GetUserSockets } from "../utils/serverStore.js";
export class Message_Handler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this.UserId = this.socket.request?.session?.user?.id;
        this.session = this.socket.request?.session;
    }
    POST_send_message = asyncHandler(async (socket_id, sender_id, receiver_id, message) => {
        const sent_message = await Message.SEND_MESSAGE(sender_id, receiver_id, message)
        if (sent_message !== null || sent_message !== undefined) {
            this.GET_user_messages(socket_id, sender_id, receiver_id);
        }
        const receiver_sockets = GetUserSockets(receiver_id.toString());
        if ((receiver_sockets !== null || receiver_sockets !== undefined) && receiver_sockets.length > 0) {
            await Message.SET_DELIVERED(sender_id, receiver_id);
            receiver_sockets.forEach((socket) => {
                this.GET_user_messages(socket, sender_id, receiver_id);
            })
        }
    })

    GET_messages = asyncHandler(async (socket_id, receiver_id) => {
        let new_messages = await Message.GET_MESSAGES(receiver_id);
        new_messages.forEach(message => {
            message.messages.forEach(async (message) => {
                await Message.SET_DELIVERED(message.sender_id, message.receiver_id);
            })
        });
        const all_messages = new_messages.map((message) => {
            return { ...message, messages: message.messages.slice(-1) }
        })
        this.io.to(socket_id).emit('GET_messages_response', all_messages);
    });

    GET_user_messages = asyncHandler(async (socket_id, sender_id, receiver_id) => {
        const user_messages = await Message.GET_USER_MESSAGES(sender_id, receiver_id);
        this.io.to(socket_id).emit('GET_user_messages_response', user_messages);
    })
}