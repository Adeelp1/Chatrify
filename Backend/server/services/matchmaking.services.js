'use strict';

const { redis_client, connectRedis } = require('../db/redisClient');
require("dotenv").config();

const REDIS_SET_NAME = process.env.REDIS_SET_NAME;
const REDIS_QUEUE_NAME = process.env.REDIS_QUEUE_NAME;

async function redisPush(userId) {
    await connectRedis();
    const isMember = await redis_client.sIsMember(REDIS_SET_NAME, String(userId));

    if (isMember > 0) {
        await redis_client.sRem(REDIS_SET_NAME, String(userId));
    }
    await redis_client.rPush(REDIS_QUEUE_NAME, String(userId));
}

async function handleDisconnectedUser(userId) {
    await connectRedis();
    await redis_client.SADD(REDIS_SET_NAME, String(userId));
}

module.exports = {
    redisPush,
    handleDisconnectedUser
};