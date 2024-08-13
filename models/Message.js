const { db } = require('../config/database');

class Message {
  static create(role, content, model) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO messages (role, content, model) VALUES (?, ?, ?)',
        [role, content, model],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM messages ORDER BY timestamp', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM messages', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Message;