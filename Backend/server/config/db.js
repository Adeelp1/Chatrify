import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

// Connect to a database 
export const db = new sqlite.Database(':memory:');
// const db = new sqlite3.Database('chatrify.db');

db.run("PRAGMA foreign_keys = ON");

// process.on('SIGINT', () => {
//     db.close((err) => {
//         if (err) console.error(err.message);
//         console.log("closed the database connection.");
//         process.exit(0);
//     });
// });

