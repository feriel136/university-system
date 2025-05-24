const pool = require('../config/db');

class Teacher {
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE user_id = ?', [userId]);
    return rows[0];
  }
}

module.exports = Teacher;