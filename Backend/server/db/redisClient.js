import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redis_client = createClient({
    username: process.env.REDIS_REST_USERNAME,
    password: process.env.REDIS_REST_PASSWORD,
    socket: { 
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        reconnectStrategy: (retries) => {
            if (retries > 5) return new Error("Retry limit reached");
            return 1000;
        }
    }
});

redis_client.on("error", (err) => {
    console.log("Redis Client Error", err);
});

export async function connectRedis() {
    if (!redis_client.isOpen) {
        await redis_client.connect();
        console.log("Redis connected");
    }
}