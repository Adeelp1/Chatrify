'use strict';

const db = require("../db");
const { get, run } = require("../utils/crudHelper");

// schema for user_session
const userSessionSchema = `
    CREATE TABLE IF NOT EXISTS user_session (
        user_id INTEGER PRIMARY KEY,
        session TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
`;

/* ------ QUERIES ------ */
const _insertQuery = `INSERT INTO user_session (user_id, session ) VALUES (?, ?)`;
const _updateSessionQuery = `UPDATE user_session SET session = ? WHERE user_id = ?`;
const _getSessionQuery = `SELECT session FROM user_session WHERE user_id = ?`;
const _getCreatedAtQuery = `SELECT created_at FROM user_session WHERE user_id = ?`;
const _isSessionExitsQuery = `SELECT user_id FROM user_session WHERE session = ?`;

/* -------- CRUD -------- */
async function insertSession(user_id, session) {
    return await run(_insertQuery, [user_id, session]);
}

async function updateSession(user_id, new_session) {
    return await run(_updateSessionQuery, [new_session, user_id]);
}

async function getSession(user_id) {
    return await get(_getSessionQuery, [user_id]);
}

async function getCreatedTime(user_id) {
    return await get(_getCreatedAtQuery, [user_id]);
}

async function isSessionExits(session) {
    return await get(_isSessionExitsQuery, [session]);
}

function initUserSession() {
    db.run(userSessionSchema, (err) => {
        if (err) return console.error("[from userSessionSchema] " + err.message);
        console.log("User Session table created");
    });
}

module.exports = {
    getSession,
    insertSession,
    updateSession,
    getCreatedTime,
    isSessionExits,
    initUserSession
}