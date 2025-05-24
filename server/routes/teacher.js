const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const teacherController = require('../controllers/teachers');

router.get('/', auth(['admin']), teacherController.getAllTeachers);
router.get('/:id', auth(), teacherController.getTeacherById);
router.get('/:id/courses', auth(['teacher']), teacherController.getTeacherCourses);

module.exports = router;