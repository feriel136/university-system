const pool = require('../config/db');

class Student {
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM students WHERE user_id = ?', [userId]);
    return rows[0];
  }
}

module.exports = Student;