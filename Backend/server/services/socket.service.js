import { getSocketIO } from "../socket/index.js";

let io = null;
let roomCounter = 0;
// let roomID;
var user_socket_map = new Map();

function generateRoomName() {
    roomCounter += 1; 
    return 'room-' + roomCounter;
}

// function getRoomSize(r_id) {
//     try {
//         return io.sockets.adapter.rooms.get(r_id).size;
//     } catch (error) {
//         return 0;
//     } 
// }

function getRoomName(socketId) {
    const rooms = Array.from(socketId.rooms);
    return rooms[1];
}

function joinRoom(userId, recommendedUserId) {
    if (!io) {
        io = getSocketIO();
    }
    
    let user_socketId = user_socket_map.get(userId);
    let recommendedUser_socketId = user_socket_map.get(recommendedUserId);

    let userA = io.sockets.sockets.get(user_socketId);
    let userB = io.sockets.sockets.get(recommendedUser_socketId);

    if (!userA || !userB) {
        console.warn("joinRoom failed:", {
            user_socketId,
            recommendedUser_socketId,
            userAExists: !!userA,
            userBExists: !!userB
        });
        return false;
    }

    let room = generateRoomName();
    userA.join(room);
    userB.join(room);

    userA.emit("roomid", {room});
    userB.emit("roomid", {room});
    console.log(room)
    userA.emit("start");
    // userB.emit("start");

    return true;
}

export {
    joinRoom,
    getRoomName,
    user_socket_map
}