'use strict';

const { createClient } = require('redis');
require("dotenv").config();

const redis_client = createClient({
    username: process.env.REDIS_REST_USERNAME,
    password: process.env.REDIS_REST_PASSWORD,
    socket: { 
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

redis_client.on('error', err => console.log('Redis Client Error', err))

async function connectRedis() {
    if (!redis_client.isOpen) {
        await redis_client.connect();
        console.log("Redis connected")
    }
}

module.exports = { redis_client, connectRedis };