'use strict';

const { v4: uuidv4 } = require('uuid'); // install uuid 
const {
    getSession,
    insertSession,
    updateSession, 
    isSessionExits,
} = require("../models/user_session_model");

function _createSessionid() {
    return uuidv4();
}

async function isUserExits(sessionId) {
    const user_id = await isSessionExits(sessionId);
    if (user_id != null) {
        // here, ensure session is not expired. if expired create new one.
        return user_id;
    }
    else {
        return false;
    }
}

async function setNewSession(user_id) {
    const sessionId = _createSessionid(); 
    const is_user_exists  = await getSession(user_id);
    
    if (is_user_exists)
        await updateSession(user_id, sessionId);
    else
        await insertSession(user_id, sessionId);

    return sessionId;
}

module.exports = {
    isUserExits,
    setNewSession
}