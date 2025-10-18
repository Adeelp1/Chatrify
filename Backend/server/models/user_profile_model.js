'use strict';

const db = require('../db');
const { run, get, all } = require('../utils/crudHelper');
// const user_matchmaking = require("./user_matchmaking_model"); // don't remove, this is used for creating user_matchmaking table

// schema for interest
const userProfileSchema = `
    CREATE TABLE IF NOT EXISTS user_profile (
        user_id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        nick_name TEXT,
        gender TEXT,
        country TEXT,
        bio TEXT,
        interests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
`;

const userProfileTrigger = `
    CREATE TRIGGER IF NOT EXISTS create_interests
    AFTER INSERT ON user_profile
    FOR EACH ROW
    BEGIN
        INSERT INTO user_matchmaking (user_id, country, gender, interests) VALUES (NEW.user_id, NEW.country, NEW.gender, NEW.interests);
    END;
`;

/* ---- SQL QUERIES ---- */
const _insertQuery = `INSERT INTO user_profile (user_id, first_name, last_name, nick_name, gender, country, interests, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const _updateFirstnameQuery = `UPDATE user_profile SET first_name = ? WHERE user_id = ?`;
const _updateLastnameQuery = `UPDATE user_profile SET last_name = ? WHERE user_id = ?`;
const _updateNicknameQuery = `UPDATE user_profile SET nick_name = ? WHERE user_id = ?`;
const _updateGenderQuery = `UPDATE user_profile SET gender = ? WHERE user_id = ?`;
const _updateCountryQuery = `UPDATE user_profile SET country = ? WHERE user_id = ?`;
const _updateBioQuery = `UPDATE user_profile SET bio = ? WHERE user_id = ?`;
const _updateInterestQuery = `UPDATE user_profile SET interests = ? WHERE user_id = ?`;
const _searchByUserIdQuery = `SELECT * FROM user_profile WHERE user_id = ?`;
const _getInterestsQuery = `SELECT interests FROM user_matchmaking WHERE user_id = ?`;
const _getAllDataQuery = `SELECT * FROM user_profile`;

/* ---------------- CRUD ---------------- */
async function createUserProfile(id, f_name, l_name, n_name, gender, country, interest, bio='') {
    return await run(_insertQuery, [id, f_name, l_name, n_name, gender, country, interest, bio]);
}

async function updateFirstname(id, f_name) {
    return await run(_updateFirstnameQuery, [f_name, id]);
}

async function updateLastname(id, l_name) {
    return await run(_updateLastnameQuery, [l_name, id]);
}

async function updateNickname(id, n_name) {
    return await run(_updateNicknameQuery, [n_name, id]);
}

async function updateGender(id, new_gender) {
    return await run(_updateGenderQuery, [new_gender, id]);
}

async function updateCountry(id, new_country) {
    return await run(_updateCountryQuery, [new_country, id]);
}

async function updateBio(id, new_bio) {
    return await run(_updateBioQuery, [new_bio, id]);
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

async function _getInterests(id) {
    return await get(_getInterestsQuery, [id]);
}

async function getAllData() {
    return await all(_getAllDataQuery);
}

function initUserProfile() {
    db.serialize(() => {
        db.run(userProfileSchema, (err) => {
            if (err) return console.error("[user profile schema] " + err.message);
            console.log("user profile table created");
        });

        db.run(userProfileTrigger, (err) => {
            if (err) return console.error("[user profile trigger] " + err.message);
            console.log("user profile trigger created");
        })
    });
}

module.exports = {
    updateBio,
    getAllData,
    updateGender,
    updateCountry,
    searchByUserid,
    updateLastname,
    updateNickname,
    updateFirstname,
    initUserProfile,
    updateInterests,
    createUserProfile
}