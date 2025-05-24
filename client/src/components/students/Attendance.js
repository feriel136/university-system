import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './PresencesList.css'; // Importez le fichier CSS

function PresencesList() {
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const response = await api.get('/presences');
        setPresences(response.data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des présences.');
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, []);

  const getStatusLabel = (present) => (
    <span className={present ? 'status-present' : 'status-absent'}>
      {present ? 'Présent' : 'Absent'}
    </span>
  );

  if (loading) return <p className="loading-message">Chargement des présences...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="presences-container">
      <h2>Liste des présences</h2>
      {presences.length === 0 ? (
        <p className="empty-message">Aucune présence enregistrée.</p>
      ) : (
        <table className="presences-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Étudiant</th>
              <th>Matière</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {presences.map((presence) => (
              <tr key={presence.id}>
                <td>{new Date(presence.date).toLocaleDateString('fr-FR')}</td>
                <td>{presence.nom_etudiant}</td>
                <td>{presence.nom_matiere}</td>
                <td>{getStatusLabel(presence.present)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PresencesList;