import { db } from "../config/db.js";

function run(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) return reject(err.message);
            resolve();
        });
    });
}

function get(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) return reject(err.message);
            resolve(row || null);
        });
    });
}

function all(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) return reject(err.message);
            resolve(rows || null);
        });
    });
}

function closeDB() {
    return new Promise((resolve, reject) => {
        db.close(err => {
            console.log("Database connection closed.");
            resolve();
        });
    });
}

export { run, get, all, closeDB }
