import sqlite3 from 'sqlite3';

const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('users.db');

const query = (command, method = 'all') => {
    return new Promise((resolve, reject) => {
        db[method](command, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};
db.serialize(async () => {
    await query("CREATE TABLE IF NOT EXISTS users (socket_id text, start_datetime text, end_datetime text)", 'run');
});

module.exports = db
