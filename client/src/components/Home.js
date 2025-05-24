import React, { useState } from 'react';
import Login from './auth/Login';
import Register from './auth/Register';
import './Home.css';
import { FiLogIn, FiUserPlus, FiBookOpen, FiCalendar, FiAward, FiChevronRight } from 'react-icons/fi';

function Home() {
  const [activeForm, setActiveForm] = useState('login');
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="home-container">
      {/* Hero Section avec effet de verre */}
      <div className="hero-glass">
        <div className="hero-content">
          <h1>
            <span className="gradient-text">Université</span> Excellence
          </h1>
          <p>L'excellence académique à portée de clic</p>
          <div className="scrolling-indicator">
            <div className="mouse"></div>
          </div>
        </div>
      </div>

      {/* Section formulaires avec onglets modernes */}
      <div className="form-section">
        <div className="tabbed-interface">
          <div className="tabs">
            <button
              className={`tab ${activeForm === 'login' ? 'active' : ''}`}
              onClick={() => setActiveForm('login')}
            >
              <FiLogIn className="tab-icon" />
              <span>Connexion</span>
              <div className="tab-indicator"></div>
            </button>
            <button
              className={`tab ${activeForm === 'register' ? 'active' : ''}`}
              onClick={() => setActiveForm('register')}
            >
              <FiUserPlus className="tab-icon" />
              <span>Inscription</span>
              <div className="tab-indicator"></div>
            </button>
          </div>

          <div className="form-content">
            {activeForm === 'login' ? (
              <Login className="animated-form" />
            ) : (
              <Register className="animated-form" />
            )}
          </div>
        </div>
      </div>

      {/* Features avec cards animées */}
      <div className="features-section">
        <h2 className="section-title">
          <span className="highlight">Découvrez</span> nos fonctionnalités
        </h2>
        
        <div className="feature-grid">
          {[
            { icon: <FiBookOpen />, title: "Bibliothèque numérique", desc: "Accès 24/7 aux ressources pédagogiques" },
            { icon: <FiCalendar />, title: "Planning intelligent", desc: "Organisation optimale de votre emploi du temps" },
            { icon: <FiAward />, title: "Suivi de performance", desc: "Analyses détaillées de vos résultats" }
          ].map((feature, index) => (
            <div 
              className={`feature-card ${hoveredCard === index ? 'hovered' : ''}`}
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <div className="card-cta">
                En savoir plus <FiChevronRight className="cta-icon" />
              </div>
              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;