'use strict';

const { userConnect, userDisconnect } = require('../client/recommenderClient');
const { redisPush, handleDisconnectedUser } = require('../services/matchmaking.services');

async function addNewConnectedUser(userId) {
    userConnect(userId);
    await redisPush(userId);
}

async function removeDisconnectedUser(userId) {
    userDisconnect(userId);
    await handleDisconnectedUser(userId);
}

module.exports = {
    addNewConnectedUser,
    removeDisconnectedUser
}