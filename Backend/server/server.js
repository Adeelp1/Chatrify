import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import lusca from "lusca";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { initSocketIO, getSocketIO } from "./socket/index.js";
import { initDB } from "./models/init.js";

const app = express();
const server = http.createServer(app);
await initSocketIO(server);
const io = getSocketIO();

dotenv.config();
initDB();

import authRoutes from "./routes/auth.js";
import matchMakingRoute from "./routes/matchmakin.route.js";
import { sessionMiddleware } from "./middleware/sessionMiddleware.js";
import { addNewConnectedUser, removeDisconnectedUser } from "./utils/userServiceHelper.js";
import { redis_client, connectRedis } from "./db/redisClient.js";
import { closeDB } from "./utils/crudHelper.js";
import { user_socket_map, getRoomName } from "./services/socket.service.js";


const PORT = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var activeUsers = 0;
// var activeRooms = [];

// var roomId;
// var roomCounter = 0;
// var clients = {};
// var user_queue = [];

// Middleware
app.use(express.json()); // to read JSON body
app.use(cookieParser()); // parse cookies from incoming requests
app.use(sessionMiddleware);
app.use(lusca.csrf());
// app.use(cors());

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Routes
app.use("/api", matchMakingRoute);
app.use("/", authRoutes);

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../../Frontend')));

io.on("connection", async (socket) => {
    const session = socket.request.session;

    if (!session.userId) {
        console.log("Unauthorized socket connection");
        socket.disconnect();
        return;
    }

    activeUsers += 1;
    socket.userId = session.userId;
    // user_queue.push(socket.id);
    user_socket_map.set(socket.userId, socket.id); // for matchmaking service
    // user_queue.push(socket.userId);
    
    console.log("New connection established", activeUsers);
    
    // info Recommend and Matchmaking Services that new user is active
    await addNewConnectedUser(socket.userId);
    
    // joinRoom(socket);

    // Session id
    // socket.on('sessionId', async (session) => {
    //     // console.log('Socket', socket.id, 'joined room: ', roomId);
    //     // clients[username] = { username, id: socket.id };
    //     // io.emit("users", clients)
    //     console.log(session);
    //     const isUser = await isUserExists(session);
    //     if (isUser)
    //         return true;
    //     else
    //         return false;
    // });

    socket.on("offer", ({r_id, offer}) => {
        console.log(`offer: ${offer}`)
        socket.broadcast.to(r_id).emit("offer", {r_id, offer});
    });

    socket.on("answer", ({r_id, answer}) => {
        console.log("room from answe " + r_id);
        // console.log(`answer: ${answer}`)
        socket.broadcast.to(r_id).emit("answer", {r_id, answer})
    });

    socket.on("icecandidate", ({r_id, candidate}) => {
        console.log("room from icecandidate " + r_id);
        // console.log(`candidate: ${candidate}`)
        socket.broadcast.to(r_id).emit("icecandidate", candidate);
    });

    socket.on("changeRoom", async () => {
        console.log("changeRoom");
        var userRoom = getRoomName(socket);
        socket.broadcast.to(userRoom).emit("closed");
        socket.leave(userRoom);
        
        // joinRoom(socket);
        await addNewConnectedUser(socket.userId);
        // console.log("new room =", getRoomName(socket));
        socket.emit("restartIce");
    });

    socket.on("disconnecting", async () => {
        const userRoom = getRoomName(socket);
        socket.broadcast.to(userRoom).emit("closed");
        socket.leave(userRoom);
        console.log("roomId", userRoom);
        
        user_socket_map.delete(socket.userId);
        // info Recommend and Matchmaking Services that the user is disconnected
        await removeDisconnectedUser(socket.userId);
    });

    socket.on("disconnect", () => {
        activeUsers -= 1;
        console.log("[connection closed]",socket.id, activeUsers);
        // delete clients[socket.id];
    });
});

server.listen(PORT, () => {
    console.log("server connected");
});

process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await connectRedis();

  try {
    // Close DB 
    await closeDB()

    // Redis cleanup
    const queueName = process.env.REDIS_QUEUE_NAME;
    let len = await redis_client.LLEN(queueName);
    console.log(`Before cleanup: ${len} items in Redis`);
    
    await redis_client.flushDb();
    console.log("Redis DB cleared");

    len = await redis_client.LLEN(queueName);
    console.log(`After cleanup: ${len} items in Redis`);

    // Close Redis connection
    await redis_client.quit();
    console.log("Redis connection closed")

  } catch (err) {
    console.error("Shutdown error:", err);
  } finally {
    process.exit(0);
  }
});