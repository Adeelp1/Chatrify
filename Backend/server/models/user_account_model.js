import { db } from '../config/db.js';
import { run, get, all } from '../utils/crudHelper.js';

// schema of user
const usersSchema = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// trigger for update timestamp
const trigger = `
    CREATE TRIGGER IF NOT EXISTS update_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = DATETIME('now') WHERE user_id = old.user_id;
    END;
`;

// ---- SQL QUERIES ----
const insertQuery = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
const updatePassQuery = `UPDATE users SET password_hash = ? WHERE user_id = ?`;
const updateUsernameQuery = `UPDATE users SET username = ? WHERE user_id = ?`;
const updateEmailQuery = `UPDATE users SET email = ? WHERE user_id = ?`;
const searchByUsernameQuery = `SELECT * FROM users WHERE username = ?`;
const searchByEmailQuery = `SELECT * FROM users WHERE email = ?`;
const getPasswordByEmailQuery = `SELECT password_hash FROM users WHERE email = ?`;
const getPasswordByUsernameQuery = `SELECT password_hash FROM users WHERE username = ?`;
const _getAllDataQuery = `SELECT * FROM users`;

// ----- CRUD Functions -----
// store user in db
export async function createUser(username, email, password_hash) {
    return await run(insertQuery, [username, email, password_hash]);
}

// update user password
export async function updatePassword(id, newPass) {
    return await run(updatePassQuery, [newPass, id]);
}

// update username
export async function updateUsername(id, newUsername) {
    return await run(updateUsernameQuery, [newUsername, id]);
}

// update user email
export async function updateEmail(id, newEmail) {
    return await run(updateEmailQuery, [newEmail, id]);
}

// search user by username
export async function searchByUsername(username) {
    return await get(searchByUsernameQuery, [username]);
}

// search user by email
export async function searchByEmail(email) {
    return await get(searchByEmailQuery, [email]);
} 

// retrieve password by email
export async function getPasswordByEmail(email) {
    return await get(getPasswordByEmailQuery, [email]);
}

// retrieve password by username
export async function getPasswordByUsername(username) {
    return await get(getPasswordByUsernameQuery, [username]);
}

export async function getAllData() {
    return await all(_getAllDataQuery);
}

export function initUser() {
    db.serialize(() =>{
        // create users table
        db.run(usersSchema, (err) => {
            if (err) {
                return console.error('Error creating table:', err.message);
            }
            console.log('Table created successfully');
        });

        // create trigger
        db.run(trigger, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("trigger created");
        });
    });
}

export default {
    initUser,
    createUser, 
    getAllData,
    updateEmail, 
    searchByEmail,
    updatePassword,
    updateUsername,  
    searchByUsername,
    getPasswordByEmail,
    getPasswordByUsername
};