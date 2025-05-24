const pool = require('../config/db');

const getAllStudents = async (req, res) => {
  try {
    const [students] = await pool.query(`
      SELECT s.*, u.email 
      FROM students s
      JOIN users u ON s.user_id = u.id
    `);
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const [students] = await pool.query(`
      SELECT s.*, u.email 
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [req.params.id]);
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(students[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createStudent = async (req, res) => {
  const { email, password, firstName, lastName, matricule } = req.body;

  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      // Créer l'utilisateur
      const hashedPassword = await bcrypt.hash(password, 10);
      const [userResult] = await conn.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, 'student']
      );
      const userId = userResult.insertId;

      // Créer l'étudiant
      await conn.query(
        'INSERT INTO students (user_id, first_name, last_name, matricule) VALUES (?, ?, ?, ?)',
        [userId, firstName, lastName, matricule]
      );

      await conn.commit();
      conn.release();

      res.status(201).json({ message: 'Student created successfully' });
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentGrades = async (req, res) => {
  try {
    const [grades] = await pool.query(`
      SELECT g.*, c.name as course_name
      FROM grades g
      JOIN enrollments e ON g.enrollment_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
    `, [req.params.id]);

    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const [attendance] = await pool.query(`
      SELECT a.*, c.name as course_name
      FROM attendances a
      JOIN enrollments e ON a.enrollment_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
    `, [req.params.id]);

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  getStudentGrades,
  getStudentAttendance
};