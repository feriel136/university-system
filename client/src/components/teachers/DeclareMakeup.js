import React, { useState, useContext } from 'react';
import { FiCalendar, FiBook, FiMail, FiSend } from 'react-icons/fi';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './DeclareMakeup.css';

function DeclareMakeup() {
  const { user } = useContext(AuthContext);

  // Tous les hooks sont ici, jamais après un return conditionnel
  const [matiere, setMatiere] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!matiere.trim() || !date || !time) {
      setFeedback({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    const datetime = `${date}T${time}:00`;

    try {
      setIsLoading(true);
      await api.post(`/enseignant/${user.profile.id}/ratrapage`, {
        matiere,
        date_rattrapage: datetime,
        message,
      });
      setFeedback({ type: 'success', text: 'Rattrapage déclaré avec succès ! Les étudiants ont été notifiés.' });

      // Réinitialiser le formulaire
      setMatiere('');
      setDate('');
      setTime('');
      setMessage('');
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', text: "Erreur lors de la déclaration du rattrapage" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="declare-makeup-container">
      <h2 className="declare-makeup-title">
        <FiCalendar className="title-icon" /> Déclarer un Rattrapage
      </h2>

      <form onSubmit={handleSubmit} className="makeup-form">
        <div className="form-group">
          <label className="form-label">
            <FiBook className="input-icon" /> Matière :
          </label>
          <input
            type="text"
            className="form-input"
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
            placeholder="Tapez la matière"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <FiCalendar className="input-icon" /> Date :
            </label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Heure :</label>
            <input
              type="time"
              className="form-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <FiMail className="input-icon" /> Message aux étudiants (optionnel) :
          </label>
          <textarea
            className="form-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Veuillez apporter vos copies d'examen..."
            rows={4}
          />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <FiSend className="button-icon" /> Envoyer la déclaration
            </>
          )}
        </button>

        {feedback.text && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.text}
          </div>
        )}
      </form>
    </div>
  );
}

export default DeclareMakeup;
