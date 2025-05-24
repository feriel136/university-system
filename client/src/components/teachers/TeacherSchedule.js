import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiBook, 
  FiChevronLeft, 
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiUser
} from 'react-icons/fi';
import './TeacherSchedule.css';

const TeacherSchedule = ({ enseignantId }) => {
  const [emploi, setEmploi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDateRange, setCurrentDateRange] = useState('');

  useEffect(() => {
    const fetchEmploi = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = enseignantId 
          ? `/api/emplois?enseignant_id=${enseignantId}`
          : '/api/emplois';
          
        const res = await axios.get(endpoint);
        
        setEmploi(groupByDay(res.data));
        updateDateRange(res.data);
      } catch (err) {
        console.error('Erreur de chargement:', err);
        setError('Erreur lors du chargement de l\'emploi du temps');
      } finally {
        setLoading(false);
      }
    };

    fetchEmploi();
  }, [enseignantId, currentWeek]);

  const groupByDay = (data) => {
    if (!data || data.length === 0) return [];
    
    const daysOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const grouped = data.reduce((acc, item) => {
      const day = item.jour;
      if (!acc[day]) acc[day] = [];
      acc[day].push({
        ...item,
        nom_matiere: item.matiere_nom || 'Matière inconnue'
      });
      return acc;
    }, {});

    return daysOrder
      .filter(day => grouped[day])
      .map(day => ({
        jour: day,
        seances: grouped[day].sort((a, b) => a.heure_debut.localeCompare(b.heure_debut))
      }));
  };

  const updateDateRange = (data) => {
    if (!data || data.length === 0) {
      setCurrentDateRange('');
      return;
    }
    
    const minDate = new Date(data[0].created_at);
    const maxDate = new Date(data[data.length - 1].created_at);
    
    setCurrentDateRange(
      `Du ${formatDate(minDate)} au ${formatDate(maxDate)}`
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.slice(0, 5);
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => Math.max(0, prev - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => prev + 1);
  };

  const getCurrentWeekText = () => {
    if (currentWeek === 0) return 'Cette semaine';
    if (currentWeek === 1) return 'Semaine prochaine';
    if (currentWeek === -1) return 'Semaine dernière';
    return `Semaine ${currentWeek > 0 ? '+' : ''}${currentWeek}`;
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>
          <FiCalendar className="header-icon" />
          Emploi du temps
        </h2>
        
        <div className="week-navigation">
          <button 
            onClick={handlePreviousWeek}
            disabled={currentWeek === 0}
            className="nav-button"
            aria-label="Semaine précédente"
          >
            <FiChevronLeft />
          </button>
          
          <div className="week-info">
            <span className="week-title">{getCurrentWeekText()}</span>
            {currentDateRange && (
              <span className="week-dates">{currentDateRange}</span>
            )}
          </div>
          
          <button 
            onClick={handleNextWeek}
            className="nav-button"
            aria-label="Semaine suivante"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <FiLoader className="spinner-icon" />
          <span>Chargement de l'emploi du temps...</span>
        </div>
      ) : error ? (
        <div className="error-state">
          <FiAlertCircle className="error-icon" />
          <span>{error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Réessayer
          </button>
        </div>
      ) : emploi.length === 0 ? (
        <div className="empty-state">
          <img 
            src="/images/empty-schedule.svg" 
            alt="Emploi du temps vide" 
            className="empty-image"
          />
          <h3>Aucun cours prévu cette semaine</h3>
          <p>Profitez-en pour préparer vos prochains cours !</p>
        </div>
      ) : (
        <div className="days-container">
          {emploi.map((daySchedule) => (
            <div key={daySchedule.jour} className="day-card">
              <div className="day-header">
                <h3>{daySchedule.jour}</h3>
              </div>
              
              <div className="seances-list">
                {daySchedule.seances.map((seance) => (
                  <div 
                    key={seance.id} 
                    className="seance-card"
                  >
                    <div className="seance-time">
                      <FiClock className="seance-icon" />
                      {formatTime(seance.heure_debut)} - {formatTime(seance.heure_fin)}
                    </div>
                    
                    <div className="seance-details">
                      <div className="seance-subject">
                        <FiBook className="seance-icon" />
                        <span>{seance.nom_matiere}</span>
                      </div>
                      
                      <div className="seance-meta">
                        <div className="seance-room">
                          <FiMapPin className="seance-icon" />
                          Salle {seance.salle}
                        </div>
                        <div className="seance-teacher">
                          <FiUser className="seance-icon" />
                          Enseignant #{seance.enseignant_id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSchedule;