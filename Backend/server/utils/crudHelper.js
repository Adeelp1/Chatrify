'use strict';

const db = require("../db");

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

module.exports = { run, get, all }