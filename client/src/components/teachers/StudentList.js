import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './StudentList.css';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await api.get('/etudiants');
        setStudents(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des étudiants');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  if (isLoading) {
    return <div className="student-list-container">Chargement...</div>;
  }

  return (
    <div className="student-list-container">
      <h2 className="student-list-title">Liste des Étudiants</h2>
      {error && <p className="error-message">{error}</p>}
      
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student.id}>
                <td data-label="ID">{student.id}</td>
                <td data-label="Nom">{student.nom}</td>
                <td data-label="Prénom">{student.prenom}</td>
                {/* <td>
                  <div className="action-buttons">
                    <button className="action-btn edit-btn">Modifier</button>
                    <button className="action-btn delete-btn">Supprimer</button>
                  </div>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-message">
                Aucun étudiant trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;