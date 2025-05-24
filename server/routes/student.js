const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const studentController = require('../controllers/students');

router.get('/', auth(['teacher', 'admin']), studentController.getAllStudents);
router.get('/:id', auth(), studentController.getStudentById);
router.post('/', auth(['teacher', 'admin']), studentController.createStudent);
router.get('/:id/grades', auth(), studentController.getStudentGrades);
router.get('/:id/attendance', auth(), studentController.getStudentAttendance);

module.exports = router;