const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000

var count = 0;
var clients = {};
var activeRooms = [];
var user_queue = [];
var roomId;
var roomCounter = 0;

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../../Frontend')));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/index.html"));
});

function generateRoomName() {
    roomCounter += 1; 
    return 'room-'+ roomCounter;
}

function getRoomSize(r_id) {
    try {
        return io.sockets.adapter.rooms.get(r_id).size;
    } catch (error) {
        return 0;
    } 
}

function getRoomName(socketId) {
    const rooms = Array.from(socketId.rooms);
    return rooms[1];
}

function joinRoom(socketId) {
    if (activeRooms.length === 0) {
        roomId = generateRoomName();
        activeRooms.push(roomId);
        socketId.join(roomId);
    }
    else {
        roomId = activeRooms[0];
        socketId.join(roomId);
        if (getRoomSize(roomId) == 2) {
            activeRooms.shift();
        }
    }
}

io.on("connection", (socket) => {
    count += 1;
    user_queue.push(socket.id);
    console.log("New connection established", socket.id, count);
    
    joinRoom(socket);

    // Session id
    socket.on('sessionId', (username) => {
        // console.log('Socket', socket.id, 'joined room: ', roomId);
        clients[username] = { username, id: socket.id };
        io.emit("users", clients)
    });

    socket.on("offer", ({r_id, offer}) => {
        socket.broadcast.to(roomId).emit("offer", {r_id, offer});
    });

    socket.on("answer", ({r_id, answer}) => {
        console.log(`answer: ${answer}`)
        socket.broadcast.to(roomId).emit("answer", answer)
    });

    socket.on("icecandidate", candidate => {
        console.log(`candidate: ${candidate}`)
        socket.broadcast.to(roomId).emit("icecandidate", candidate);
    });

    socket.on("changeRoom", () => {
        console.log("changeRoom");
        var userRoom = getRoomName(socket);
        socket.broadcast.to(userRoom).emit("colsed");
        socket.leave(userRoom);

        if (getRoomSize(userRoom) === 1) {
            activeRooms.push(userRoom);
        }
        
        joinRoom(socket);
        console.log("new room =", getRoomName(socket));
        console.log("[room] active Rooms = ", activeRooms);
        socket.emit("restartIce");
    });

    socket.on("disconnecting", () => {
        // const rooms = Array.from(socket.rooms);
        const userRoom = getRoomName(socket);
        socket.broadcast.to(userRoom).emit("colsed");
        socket.leave(userRoom);
        if (getRoomSize(userRoom) == 1) {
            activeRooms.push(userRoom);
        }
        console.log("roomId", userRoom);
    });

    socket.on("disconnect", () => {
        count -= 1;
        const roomSize = getRoomSize(roomId);
        console.log("[connection closed]",socket.id, count);
        console.log("room size", roomSize);
        delete clients[socket.id];
    });
});

server.listen(port, () => {
    console.log("server connected");
});