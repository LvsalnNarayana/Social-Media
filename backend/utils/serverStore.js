import _ from 'lodash';
const connected_users = new Map();

let io = null;

export const set_socket_server_instance = (io_instance) => {
    io = io_instance
}

export const get_socket_server_instance = () => {
    return io;
}

export const addNewConnectedUser = ({ socketId, userId }) => {
    connected_users.set(socketId, { userId });
};

export const GetUserSockets = (user_Id) => {
    const active_users = [];
    const activeSockets = [];
    if (user_Id !== null || user_Id !== undefined) {
        connected_users.forEach((value, key) => {
            active_users.push({
                socket_id: key,
                user_id: value.userId
            })
        })
        active_users.forEach((data) => {
            if (data.user_id === user_Id) {
                activeSockets.push(data.socket_id)
            }
        })
    }
    return activeSockets;
}

export const deleteConnectedUser = (socketId) => {
    if (connected_users.has(socketId)) {
        connected_users.delete(socketId);
    }
}

export const Get_User_By_Socket = (socket_id) => {
    const active_users = [];
    if (socket_id !== null || socket_id !== undefined) {
        connected_users.forEach((value, key) => {
            active_users.push({
                socket_id: key,
                user_id: value.userId
            })
        })
        const user_socket = active_users.filter((data) => {
            return data.socket_id === socket_id
        });
        return user_socket[0]?.user_id
    }
}
function getValue(object, propString) {
    let value = object;
    const props = propString.split('.');
    for (let index = 0; index < props.length; index += 1) {
        if (props[index] === undefined) break;
        value = value[props[index]];
    }
    return value;
}

export const set_session_storage = (session, key, value) => {
    if (session !== null && session !== undefined) {
        session[key] = value;
        session.save();
    } else {
        return false
    }
}