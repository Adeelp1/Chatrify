const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000

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
    socket.on('joinRoom', (username) => {
        // socket.join(roomId);
        // console.log('Socket', socket.id, 'joined room: ', roomId);
        clients[username] = { username, id: socket.id };
        io.emit("users", clients)
    });

    socket.on("offer", ({from, to, offer}) => {
        console.log(`from: ${from} to: ${to} offer: ${offer}`)
        io.to(clients[to].id).emit("offer", {from, to, offer});
    });

    socket.on("answer", ({from, to, answer}) => {
        io.to(clients[from].id).emit("answer", answer)
    });

    socket.on("icecandidate", candidate => {
        console.log(`candidate: ${candidate}`)
        socket.broadcast.emit("icecandidate", candidate);
    });

    socket.on("disconnect", () => {
        count -= 1;
        console.log("connection closed",socket.id, count);
        delete clients[socket.id]
    });
});

server.listen(port, () => {
    console.log("server connected");
});