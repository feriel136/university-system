import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FiUsers, FiCalendar, FiBook, FiFileText,
  FiAward, FiBarChart2, FiSettings,
  FiBell, FiSearch, FiUser, FiPlus,
  FiHome, FiList, FiMail, FiLogOut
} from 'react-icons/fi';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [stats, setStats] = useState([
    { id: 1, title: "Étudiants", value: "1,245", change: "+12%", trend: 'up', icon: <FiUsers /> },
    { id: 2, title: "Enseignants", value: "68", change: "+5%", trend: 'up', icon: <FiUser /> },
    { id: 3, title: "Cours", value: "42", change: "-3%", trend: 'down', icon: <FiBook /> },
    { id: 4, title: "Matières", value: "28", change: "+8%", trend: 'up', icon: <FiFileText /> }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: "Mohamed Ben Hsan", action: "a ajouté un nouveau cours", time: "10 min ago", icon: <FiPlus /> },
    { id: 2, user: "Safa Abid", action: "a soumis un document", time: "25 min ago", icon: <FiFileText /> },
    { id: 3, user: "Admin", action: "a créé un nouvel utilisateur", time: "1h ago", icon: <FiUser /> }
  ]);

  const [quickActions] = useState([
    { id: 1, title: "Ajouter Étudiant", icon: <FiUser />, path: "/admin/AddStudent" },
    { id: 2, title: "Créer Cours", icon: <FiCalendar />, path: "/admin/create-course" },
    { id: 3, title: "Gérer Matières", icon: <FiBook />, path: "/admin/AddSubject" },
    { id: 4, title: "Publier Annonce", icon: <FiFileText />, path: "/admin/post-announcement" }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/Home');
  };

  const isDashboardHome = location.pathname === "/admin";

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="avatar">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{user?.prenom} {user?.nom}</h3>
              <span>Administrateur</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
            <FiHome className="nav-icon" />
            <span>Accueil</span>
          </NavLink>

          <div className="nav-section">
            <h4>Gestion Utilisateurs</h4>
            <NavLink to="/admin/AddStudent" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUser className="nav-icon" />
              <span>Ajouter Étudiant</span>
            </NavLink>
            <NavLink to="/admin/AddTeacher" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUser className="nav-icon" />
              <span>Ajouter Enseignant</span>

            </NavLink>
              <NavLink to="/admin/AddSubject" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiBook className="nav-icon" />
              <span> Ajouter Matières</span>
            </NavLink>
            <NavLink to="/admin/StudentsList" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiList className="nav-icon" />
              <span>Liste Étudiants</span>
            </NavLink>
            <NavLink to="/admin/TeachersList" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiList className="nav-icon" />
              <span>Liste Enseignants</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <h4>Gestion Pédagogique</h4>
            <NavLink to="/admin/AddSchedule" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiCalendar className="nav-icon" />
              <span>Emploi du temps</span>
            </NavLink>
          
                <NavLink to="/admin/Events" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiBook className="nav-icon" />
              <span>event</span>
     
            </NavLink>
                <NavLink to="/admin/InternshipsProjects" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiBook className="nav-icon" />
              <span>project</span>
            </NavLink>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
          <h2>Tableau de Bord Administrateur</h2>
          <div className="top-bar-actions">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Rechercher..." className="search-input" />
            </div>
            <div className="notifications">
              <FiBell className="notification-icon" />
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          {isDashboardHome ? (
            <div className="admin-dashboard">
              <section className="stats-section">
                <div className="section-header">
                  <FiBarChart2 className="section-icon" />
                  <h2>Aperçu Général</h2>
                </div>
                <div className="stats-grid">
                  {stats.map(stat => (
                    <div key={stat.id} className={`stat-card ${stat.trend}`}>
                      <div className="stat-icon">{stat.icon}</div>
                      <div className="stat-info">
                        <h3>{stat.value}</h3>
                        <p>{stat.title}</p>
                      </div>
                      <span className="stat-change">
                        {stat.change} {stat.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="dashboard-columns">
                <section className="activity-section">
                  <div className="section-header">
                    <FiAward className="section-icon" />
                    <h2>Activités Récentes</h2>
                  </div>
                  <div className="activity-list">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">{activity.icon}</div>
                        <div className="activity-content">
                          <p><strong>{activity.user}</strong> {activity.action}</p>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="quick-actions-section">
                  <div className="section-header">
                    <FiSettings className="section-icon" />
                    <h2>Actions Rapides</h2>
                  </div>
                  <div className="actions-grid">
                    {quickActions.map(action => (
                      <NavLink key={action.id} to={action.path} className="action-card">
                        <div className="action-icon">{action.icon}</div>
                        <span className="action-title">{action.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </section>
              </div>

              <section className="documents-section">
                <div className="section-header">
                  <h2>Derniers Documents Ajoutés</h2>
                </div>
                <div className="documents-list">
                  <p className="empty-state">Aucun document récent</p>
                </div>
              </section>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
