const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000

var count = 0;
var clients = {}
var user_queue = [];
var roomId;

// Server static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../../Frontend')));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/index.html"));
});

function generateUuid() {
    return uuidv4();
}

roomId = generateUuid();

io.on("connection", (socket) => {
    count += 1;
    user_queue.push(socket.id);
    console.log("New connection established", socket.id, count);

    socket.join(roomId);
    socket.emit("roomid", roomId);
    
    // Session id
    socket.on('sessionId', (username) => {
        // console.log('Socket', socket.id, 'joined room: ', roomId);
        clients[username] = { username, id: socket.id };
        io.emit("users", clients)
    });

    socket.on("offer", ({r_id, offer}) => {
        console.log(`r_id: ${r_id} offer: ${offer}`)
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

    socket.on("disconnect", () => {
        const rooms = Array.from(socket.rooms);
        const userRoom = rooms[1];
        count -= 1;

        console.log("connection closed",socket.id, count);

        socket.leave(userRoom)
        delete clients[socket.id]
    });
});

server.listen(port, () => {
    console.log("server connected");
});