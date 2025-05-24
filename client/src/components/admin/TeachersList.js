import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Assure-toi que api pointe vers le backend

function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await api.get('/enseignants'); // route backend pour liste enseignants
        setTeachers(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des enseignants');
      }
    }
    fetchTeachers();
  }, []);

  return (
    <div>
      <h2>Liste des Enseignants</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th></th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Département</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map(teacher => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.nom}</td>
                <td>{teacher.prenom}</td>
                <td>{teacher.email}</td>
                <td>{teacher.departement}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">Aucun enseignant trouvé</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TeachersList;
