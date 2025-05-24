const pool = require('../config/db');

const getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await pool.query(`
      SELECT t.*, u.email 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
    `);
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const [teachers] = await pool.query(`
      SELECT t.*, u.email 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [req.params.id]);
    
    if (teachers.length === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teachers[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const [courses] = await pool.query(
      'SELECT * FROM courses WHERE teacher_id = ?',
      [req.params.id]
    );
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  getTeacherCourses
};