const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

var count = 0;
var clients = {}

// Server static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../../Frontend')));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/index.html"));
});

io.on("connection", (socket) => {
    count += 1;
    console.log("New connection established", socket.id, count);

    // join a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log('Socket', socket.id, 'joined room: ', roomId);
        clients[socket.id] = roomId;
    })

    socket.on("disconnect", () => {
        count -= 1;
        console.log("connection closed",socket.id, count);
        delete clients[socket.id]
    })
});

const port = 3000
server.listen(port, () => {
    console.log("server connected");
});