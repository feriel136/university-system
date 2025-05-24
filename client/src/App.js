import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages publiques
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboards
import StudentDashboard from './components/students/Dashboard';
import TeacherDashboard from './components/teachers/Dashboard';
import AdminDashboard from './components/admin/Dashboard';

// Routes protégées
import PrivateRoute from './components/shared/PrivateRoute';

// Composants étudiants
import Grades from './components/students/Grades';
import StudentSchedule from './components/students/Schedule';
import Attendance from './components/students/Attendance';
import CourseDownloadButton from './components/students/ListDocumts';
// Composants enseignants
import ManageAttendance from './components/teachers/ManageAttendance';
import StudentList from './components/teachers/StudentList';
import ManageGrades from './components/teachers/ManageGrades';
import TeacherSchedule from './components/teachers/TeacherSchedule';
import DeclareMakeup from './components/teachers/DeclareMakeup';
import UploadCourse from './components/teachers/UploadCourse';

// Composants admin
import AddStudentAdmin from './components/admin/AddStudent';
import AddTeacher from './components/admin/AddTeacher';
import AddSchedule from './components/admin/AddSchedule';
import StudentsList from './components/admin/StudentsList';
import TeachersList from './components/admin/TeachersList';
import AddSubject from './components/admin/AddSubject';
import Events from './components/admin/Events';
import InternshipsProjects from './components/admin/InternshipsProjects';
import OfficialDocuments from './components/admin/OfficialDocuments';

// Page Cours (si tu veux l'ajouter)

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Étudiant */}
        <Route
          path="/students/*"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          }
        >
          <Route path="Grades" element={<Grades />} />
          <Route path="Schedule" element={<StudentSchedule />} />
          <Route path="Attendance" element={<Attendance />} />
          <Route path="ListDocumnts" element={<CourseDownloadButton />} />
          <Route index element={<Navigate to="Grades" replace />} />
        </Route>

        {/* Enseignant */}
        <Route
          path="/teachers/*"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        >
          <Route path="StudentList" element={<StudentList />} />
          <Route path="ManageGrades" element={<ManageGrades />} />
          <Route path="ManageAttendance" element={<ManageAttendance />} />
          <Route path="TeacherSchedule" element={<TeacherSchedule />} />
          <Route path="UploadCourse" element={<UploadCourse />} />
          <Route path="DeclareMakeup" element={<DeclareMakeup />} />
          <Route index element={<Navigate to="StudentList" replace />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="AddStudent" element={<AddStudentAdmin />} />
          <Route path="AddTeacher" element={<AddTeacher />} />
          <Route path="AddSchedule" element={<AddSchedule />} />
          <Route path="StudentsList" element={<StudentsList />} />
          <Route path="TeachersList" element={<TeachersList />} />
          <Route path="AddSubject" element={<AddSubject />} />
          <Route path="Events" element={<Events />} />
          <Route path="InternshipsProjects" element={<InternshipsProjects />} />
          <Route path="OfficialDocuments" element={<OfficialDocuments />} />
          <Route index element={<Navigate to="StudentsList" replace />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;
