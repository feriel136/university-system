import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiCalendar, FiBook, FiUser, FiLogOut,
  FiAward, FiBell, FiMenu, FiX
} from 'react-icons/fi';
import './StudentDashboard.css';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Nouvelle note en Algorithmique", read: false },
    { id: 2, text: "Absence justifiée", read: false }
  ]);

  const [stats] = useState([
    { id: 1, title: "Moyenne générale", value: "14.5", icon: <FiAward />, trend: 'up' },
    { id: 2, title: "Absences ce mois", value: "2", icon: <FiUser />, trend: 'down' },
    { id: 3, title: "Prochains cours", value: "3", icon: <FiCalendar />, trend: 'neutral' }
  ]);

  const [recentGrades] = useState([
    { id: 1, subject: "Mathématiques", grade: "15", date: "12/05/2025" },
    { id: 2, subject: "Physique", grade: "13", date: "08/05/2025" },
    { id: 3, subject: "Informatique", grade: "16", date: "05/05/2025" }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = () => {
    if (window.innerWidth <= 768) {
      setMobileMenuOpen(false);
    }
  };

  const markNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const isDashboardRoute = location.pathname === "/students/dashboard";

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="avatar">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{user?.prenom} {user?.nom}</h3>
              <span>Étudiant - {user?.specialite || 'Informatique'}</span>
              <span>Groupe: {user?.groupe || 'A1'}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/students/dashboard" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleNavigation}>
            <FiHome className="nav-icon" />
            <span>Tableau de bord</span>
          </NavLink>
          <NavLink to="/students/grades" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleNavigation}>
            <FiAward className="nav-icon" />
            <span>Mes Notes</span>
          </NavLink>
          <NavLink to="/students/attendance" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleNavigation}>
            <FiUser className="nav-icon" />
            <span>Mes Absences</span>
          </NavLink>
          <NavLink to="/students/schedule" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleNavigation}>
            <FiCalendar className="nav-icon" />
            <span>Emploi du temps</span>
          </NavLink>
          <NavLink to="/students/ListDocumnts" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleNavigation}>
            <FiBook className="nav-icon" />
            <span>Cours</span>
          </NavLink>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut className="nav-icon" />
              <span>Déconnexion</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-bar">
          <button className="menu-toggle" onClick={handleMenuToggle}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h2>Tableau de Bord Étudiant</h2>
          <div className="top-bar-actions">
            <div className="notifications" onClick={markNotificationsAsRead}>
              <FiBell className="notification-icon" />
              {notifications.some(n => !n.read) && <span className="notification-badge"></span>}
              {showNotifications && (
                <div className="notification-dropdown">
                  {notifications.map(n => (
                    <div key={n.id} className={`notification-item ${n.read ? 'read' : ''}`}>
                      {n.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />

          {isDashboardRoute && (
            <div className="dashboard-content">
              <div className="stats-grid">
                {stats.map(stat => (
                  <div key={stat.id} className={`stat-card ${stat.trend}`}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-info">
                      <h3>{stat.value}</h3>
                      <p>{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-section">
                <h3 className="section-title">
                  <FiAward className="section-icon" />
                  Dernières notes
                </h3>
                <div className="grades-list">
                  {recentGrades.map(grade => (
                    <div key={grade.id} className="grade-item">
                      <div className="grade-subject">{grade.subject}</div>
                      <div className="grade-value">{grade.grade}/20</div>
                      <div className="grade-date">{grade.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-section">
                <h3 className="section-title">
                  <FiCalendar className="section-icon" />
                  Prochains cours
                </h3>
                <div className="next-classes">
                  <div className="next-class">
                    <div className="class-time">08:00 - 10:00</div>
                    <div className="class-info">
                      <h4>Algorithmique</h4>
                      <p>Salle B203 - Prof. Dupont</p>
                    </div>
                  </div>
                  <div className="next-class">
                    <div className="class-time">10:15 - 12:15</div>
                    <div className="class-info">
                      <h4>Base de données</h4>
                      <p>Salle A102 - Prof. Martin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
