import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  FiBook, FiCalendar, FiUsers, FiAward, FiLogOut,
  FiHome, FiBell, FiUser, FiClock, FiBarChart2,
  FiMessageSquare, FiAlertCircle
} from 'react-icons/fi';
import './teachersDashboard.css';

function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Réunion pédagogique demain à 10h", read: false },
    { id: 2, text: "3 nouveaux messages non lus", read: false }
  ]);

  const stats = {
    students: 32,
    pendingGrades: 15,
    absences: 8,
    upcomingClasses: 3
  };

  const recentActivities = [
    { id: 1, text: "Vous avez saisi les notes de mathématiques", time: "il y a 2h" },
    { id: 2, text: "Nouvel étudiant inscrit dans votre classe", time: "hier" },
    { id: 3, text: "Absence justifiée par Jean Dupont", time: "avant-hier" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const isDashboardRoute = window.location.pathname === "/teachers/dashboard";

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="avatar">
              <FiUser size={24} />
            </div>
            <div className="user-info">
              <h3>Prof. {user?.nom || "Inconnu"}</h3>
              <span>Enseignant</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/teachers/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiBarChart2 className="nav-icon" />
            <span>Tableau de bord</span>
          </NavLink>
          <NavLink to="/teachers/StudentList" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiUsers className="nav-icon" />
            <span>Liste des Étudiants</span>
          </NavLink>
          <NavLink to="/teachers/ManageGrades" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiAward className="nav-icon" />
            <span>Gérer les Notes</span>
          </NavLink>
          <NavLink to="/teachers/ManageAttendance" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiCalendar className="nav-icon" />
            <span>Gérer les Absences</span>
          </NavLink>
          <NavLink to="/teachers/TeacherSchedule" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiBook className="nav-icon" />
            <span>Emploi du Temps</span>
          </NavLink>
         
          <NavLink to="/teachers/UploadCourse" className={({ isActive }) => isActive ? 'active' : ''}>
  <FiBook className="nav-icon" />
  <span>cours</span>
</NavLink>
<NavLink to="/teachers/DeclareMakeup" className={({ isActive }) => isActive ? 'active' : ''}>
  <FiAward className="nav-icon" />
  <span>Attribuer Note
    
  </span>
</NavLink>

        </nav>

        <div className="sidebar-footer">
          <NavLink to="/Home" className="home-link">
            <FiHome className="nav-icon" />
            <span>Retour à l'accueil</span>
          </NavLink>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut className="nav-icon" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <h2>Tableau de bord</h2>
          <div className="top-bar-actions">
            <div className="search-box">
              <input type="text" placeholder="Rechercher..." />
            </div>

            <div className="notifications">
              <div className="notification-icon">
                <FiBell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="notification-badge"></span>
                )}
              </div>
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <button onClick={markAllAsRead}>Tout marquer comme lu</button>
                </div>
                {notifications.length === 0 ? (
                  <div className="notification-item read">Aucune notification</div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.read ? 'read' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      {notification.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <Outlet />

          {isDashboardRoute && (
            <div className="dashboard-content">
              {/* Widgets */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon students">
                    <FiUsers size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.students}</h3>
                    <p>Étudiants</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon grades">
                    <FiAward size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.pendingGrades}</h3>
                    <p>Notes à saisir</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon absences">
                    <FiAlertCircle size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.absences}</h3>
                    <p>Absences cette semaine</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon classes">
                    <FiClock size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.upcomingClasses}</h3>
                    <p>Cours aujourd'hui</p>
                  </div>
                </div>
              </div>

              {/* Prochain cours */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <FiClock className="section-icon" />
                  Prochain cours
                </h3>
                <div className="next-class-card">
                  <div className="class-time">
                    <span>10:00 - 12:00</span>
                    <span>Aujourd'hui</span>
                  </div>
                  <div className="class-info">
                    <h4>Mathématiques avancées</h4>
                    <p>Salle B204 - Groupe A</p>
                  </div>
                  <button className="class-prep-btn">Préparer le cours</button>
                </div>
              </div>

              {/* Activités récentes */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <FiCalendar className="section-icon" />
                  Activités récentes
                </h3>
                <div className="activities-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <p>{activity.text}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
