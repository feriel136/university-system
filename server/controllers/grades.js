const pool = require('../config/db');

const addGrade = async (req, res) => {
  const { enrollmentId, grade, remarks } = req.body;
  const teacherId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO grades (enrollment_id, grade, remarks, recorded_by) VALUES (?, ?, ?, ?)',
      [enrollmentId, grade, remarks, teacherId]
    );
    
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGrade = async (req, res) => {
  const { grade, remarks } = req.body;

  try {
    await pool.query(
      'UPDATE grades SET grade = ?, remarks = ? WHERE id = ?',
      [grade, remarks, req.params.id]
    );
    
    res.json({ message: 'Grade updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addAttendance = async (req, res) => {
  const { enrollmentId, date, status } = req.body;
  const teacherId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO attendances (enrollment_id, date, status, recorded_by) VALUES (?, ?, ?, ?)',
      [enrollmentId, date, status, teacherId]
    );
    
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAttendance = async (req, res) => {
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE attendances SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    res.json({ message: 'Attendance updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addGrade,
  updateGrade,
  addAttendance,
  updateAttendance
};