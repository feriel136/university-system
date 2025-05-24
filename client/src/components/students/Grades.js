import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // ton instance axios ou fetch configurée

function AllNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await api.get('/notes');  // <-- ici le chemin qui correspond à ton backend
        setNotes(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement notes:', err);
        setLoading(false);
      }
    };
    fetchAllNotes();
  }, []);

  if (loading) return <p>Chargement des notes...</p>;
  if (notes.length === 0) return <p>Aucune note trouvée.</p>;

  return (
    <div>
      <h2>Toutes les notes</h2>
      <table>
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Matière</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr key={note.id}>
            <td data-label="Étudiant">{note.nom_etudiant}</td>
<td data-label="Matière">{note.matiere}</td>
<td data-label="Note">{note.note}/20</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllNotes;
