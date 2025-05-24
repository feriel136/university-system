import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Schedule.css';

function StudentSchedule() {
  const { user } = useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get(`/schedules/student/${user.profile.id}`);
        setSchedule(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user]);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const times = ['08:00', '10:00', '12:00', '14:00', '16:00'];

  if (loading) return <div>Chargement de l'emploi du temps...</div>;

  return (
    <div className="schedule-container">
      <h2>Mon Emploi du Temps</h2>
      <div className="schedule-grid">
        <div className="schedule-header">
          <div className="time-column">Heure</div>
          {days.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>

        {times.map(time => (
          <React.Fragment key={time}>
            <div className="time-slot">{time}</div>
            {days.map((day, dayIndex) => {
              // Trouver le cours pour ce jour et cette heure
              const course = schedule.find(item =>
                item.jour === dayIndex + 1 &&
                item.heure_debut <= time &&
                item.heure_fin > time
              );

              return (
                <div key={`${day}-${time}`} className="schedule-cell">
                  {course ? (
                    <div className="course-card">
                      <h4>{course.matiere_nom || 'Nom Matière'}</h4> {/* Assure-toi que ton API renvoie ce champ */}
                      <p>Salle: {course.salle}</p>
                      <p>{course.heure_debut} - {course.heure_fin}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default StudentSchedule;
