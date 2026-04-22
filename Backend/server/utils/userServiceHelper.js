import { userConnect, userDisconnect } from '../client/recommenderClient.js';
import { redisPush, handleDisconnectedUser } from '../services/matchmaking.services.js';

async function addNewConnectedUser(userId) {
    userConnect(userId);
    await redisPush(userId);
}

async function removeDisconnectedUser(userId) {
    userDisconnect(userId);
    await handleDisconnectedUser(userId);
}

export { addNewConnectedUser, removeDisconnectedUser }
