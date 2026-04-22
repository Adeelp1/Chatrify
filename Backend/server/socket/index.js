let io;

export async function initSocketIO(server) {
    const { Server } = await import("socket.io");

    io = new Server(server, {
        cors: {
            credentials: true
        }
    });
}

export function getSocketIO() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}