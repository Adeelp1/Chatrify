"use strict";

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
// const cors = require("cors");

const authRoutes = require("./routes/auth");
const db = require('./config/db');
const initDB = require("./models/init");
const { sessionMiddleware } = require("./middleware/sessionMiddleware");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        Credential: true
    }
});

const port = 3000

var activeUsers = 0;
var activeRooms = [];
var user_queue_map = new Map();
var roomId;
var roomCounter = 0;
// var clients = {};
// var user_queue = [];

// Middleware
app.use(express.json()); // to read JSON body
app.use(cookieParser()); // parse cookies from incoming requests
app.use(sessionMiddleware);
// app.use(cors());

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Routes
app.use("/", authRoutes);

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../../Frontend')));

function generateRoomName() {
    roomCounter += 1; 
    return 'room-' + roomCounter;
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
    const session = socket.request.session;

    if (!session.userId) {
        console.log("Unauthorized socket connection");
        socket.disconnect();
        return;
    }

    activeUsers += 1;
    socket.userId = session.userId;
    // user_queue.push(socket.id);
    user_queue_map.set(socket.userId, socket.id); // for recomendation engine

    console.log("New connection established", activeUsers);
    
    joinRoom(socket);

    // Session id
    // socket.on('sessionId', async (session) => {
    //     // console.log('Socket', socket.id, 'joined room: ', roomId);
    //     // clients[username] = { username, id: socket.id };
    //     // io.emit("users", clients)
    //     console.log(session);
    //     const isUser = await isUserExits(session);
    //     if (isUser)
    //         return true;
    //     else
    //         return false;
    // });

    socket.on("offer", ({r_id, offer}) => {
        socket.broadcast.to(roomId).emit("offer", {r_id, offer});
    });

    socket.on("answer", ({r_id, answer}) => {
        // console.log(`answer: ${answer}`)
        socket.broadcast.to(roomId).emit("answer", answer)
    });

    socket.on("icecandidate", candidate => {
        // console.log(`candidate: ${candidate}`)
        socket.broadcast.to(roomId).emit("icecandidate", candidate);
    });

    socket.on("changeRoom", () => {
        console.log("changeRoom");
        var userRoom = getRoomName(socket);
        socket.broadcast.to(userRoom).emit("closed");
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
        const userRoom = getRoomName(socket);
        socket.broadcast.to(userRoom).emit("closed");
        socket.leave(userRoom);
        user_queue_map.delete(socket.userId);
        if (getRoomSize(userRoom) == 1) {
            activeRooms.push(userRoom);
        }
        console.log("roomId", userRoom);
    });

    socket.on("disconnect", () => {
        activeUsers -= 1;
        const roomSize = getRoomSize(roomId);
        console.log("[connection closed]",socket.id, activeUsers);
        console.log("room size", roomSize);
        // delete clients[socket.id];
    });
});

initDB();
server.listen(port, () => {
    console.log("server connected");
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log("closed the database connection.");
        process.exit(0);
    });
}); 