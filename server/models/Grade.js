const pool = require('../config/db');

class Grade {
  static async findByEnrollment(enrollmentId) {
    const [rows] = await pool.query('SELECT * FROM grades WHERE enrollment_id = ?', [enrollmentId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM grades WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = Grade;