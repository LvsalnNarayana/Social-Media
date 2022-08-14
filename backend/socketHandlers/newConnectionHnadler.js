import { addNewConnectedUser } from "../utils/serverStore.js";
const newConnectionHandler = (socket, io) => {
    addNewConnectedUser({
        socketId: socket.id,
        userId: socket.request?.session?.user?.id
    })
}
export default newConnectionHandler