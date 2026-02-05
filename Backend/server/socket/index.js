"use strict";

let io;

function initSocketIO(server) {
    const socketIO = require("socket.io");
    
    io = socketIO(server, {
        cors: {
            Credential: true
        }
    });
}

function getSocketIO() {
    if(!io) throw new Error("Socket.io not initialized");
    return io;
}

module.exports = {
    initSocketIO,
    getSocketIO
}