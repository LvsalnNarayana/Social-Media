import { deleteConnectedUser } from "../utils/serverStore.js";
import { addNewConnectedUser } from "../utils/serverStore.js";

const newConnectionHandler = (socket, io) => {
    addNewConnectedUser({
        socketId: socket.id,
        userId: socket.request?.session?.user?.id
    })
};

const disconnectHanlder = (socket) => {
    deleteConnectedUser(socket.id)
};

