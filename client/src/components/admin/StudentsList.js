import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Assure-toi que api pointe vers le backend
import './StudentList.css';  // ou './Tables.css'

function StudentList() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await api.get('/etudiants'); // route backend pour liste étudiants
        setStudents(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des étudiants');
      }
    }
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Liste des Étudiants</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(students => (
              <tr key={students.id}>
                <td>{students.id}</td>
                <td>{students.nom}</td>
                <td>{students.prenom}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">Aucun étudiant trouvé</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
