'use strict';

const db = require('../db');
const { run, get, all} = require('../utils/crudHelper');

// schema for interest
const matchMakingSchema = `
    CREATE TABLE IF NOT EXISTS user_matchmaking (
        user_id INTEGER PRIMARY KEY,
        country TEXT NOT NULL,
        gender TEXT NOT NULL,
        interests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
`;

/* ---- SQL QUERIES ---- */
// const _insertQuery = `INSERT INTO user_matchmaking (user_id, country, gender, interests ) VALUES (?, ?, ?, ?)`;
const _updateCountryQuery = `UPDATE user_matchmaking SET country = ? WHERE user_id = ?`;
const _updateGenderQuery = `UPDATE user_matchmaking SET gender = ? WHERE user_id = ?`;
const _updateInterestQuery = `UPDATE user_matchmaking SET interests = ? WHERE user_id = ?`;
const _searchByUserIdQuery = `SELECT * FROM user_matchmaking WHERE user_id = ?`;
const _getMatchMakingDetailQuery = `SELECT country, gender, interests FROM user_matchmaking WHERE user_id = ?`;
const _getInterestsQuery = `SELECT interests FROM user_matchmaking WHERE user_id = ?`;
const _getAllDataQuery = `SELECT * FROM user_matchmaking`;

/* ---------------- CRUD ---------------- */
// async function createMatchmaking(user_id, country, gender, interests) {
//     return await run(_insertQuery, [user_id, country, gender, interests]);
// }

async function updateCountry(id, new_country) {
    return await run(_updateCountryQuery, [new_country, id]);
}

async function updateGender(id, new_gender) {
    return await run(_updateGenderQuery, [new_gender, id]);
}

async function updateInterests(id, new_interest) {
    let interests = await _getInterests(id);
    interests = interests.interests;
    interests += ", " + new_interest;
    return await run(_updateInterestQuery, [interests, id]);
}

async function searchByUserid(id) {
    return await get(_searchByUserIdQuery, [id]);
}

async function getMatchmakingDetails(id) {
    return await get(_getMatchMakingDetailQuery, [id]);
}

async function _getInterests(id) {
    return await get(_getInterestsQuery, [id]);
}

async function getAllData() {
    return await all(_getAllDataQuery);
}

function initUserMatchMacking() {
    db.run(matchMakingSchema, (err) => {
        if (err) return console.error(err.message + "[ from user match making schema creation ]");
        console.log("Match making table created");
    });
    // console.log("user match making table created");
}


module.exports = {
    getAllData,
    updateGender,
    updateCountry,
    searchByUserid,
    updateInterests,
    initUserMatchMacking,
    getMatchmakingDetails
}