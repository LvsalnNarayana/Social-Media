import { deleteConnectedUser } from "../utils/serverStore.js"
const disconnectHanlder = (socket) => {
    deleteConnectedUser(socket.id)
}

export default disconnectHanlder