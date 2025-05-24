import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ManageGrades.css';

function ManageGrades() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [etudiants, setEtudiants] = useState([]);
  const [matieres, setMatieres] = useState([]);

  const [form, setForm] = useState({
    id: null,
    etudiant_id: '',
    matiere: '',
    note: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, etudiantsRes, matieresRes] = await Promise.all([
          api.get('/notes'),
          api.get('/etudiants'),
          api.get('/matieres'),
        ]);
        setNotes(notesRes.data);
        setEtudiants(etudiantsRes.data);
        setMatieres(matieresRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement données:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (note) => {
    setForm({
      id: note.id,
      etudiant_id: note.etudiant_id,
      matiere: note.matiere,
      note: note.note,
    });
  };

  const handleCancel = () => {
    setForm({
      id: null,
      etudiant_id: '',
      matiere: '',
      note: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.etudiant_id || !form.matiere || form.note === '') {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      if (form.id) {
        await api.put(`/notes/${form.id}`, {
          etudiant_id: form.etudiant_id,
          matiere: form.matiere,
          note: parseFloat(form.note),
        });
        alert('Note modifiée avec succès');
      } else {
        await api.post('/notes', {
          etudiant_id: form.etudiant_id,
          matiere: form.matiere,
          note: parseFloat(form.note),
        });
        alert('Note ajoutée avec succès');
      }

      const res = await api.get('/notes');
      setNotes(res.data);
      handleCancel();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  if (loading) return <div>Chargement des notes...</div>;

  return (
    <div className="teacher-data-container">
      <h2>Gérer les Notes</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Matière</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notes.length === 0 ? (
            <tr><td colSpan="4">Aucune note trouvée.</td></tr>
          ) : (
            notes.map(note => (
              <tr key={note.id}>
                <td>{note.nom_etudiant} {note.prenom_etudiant}</td>
                <td>{note.matiere}</td>
                <td>{note.note}</td>
                <td>
                  <button onClick={() => handleEdit(note)}>Modifier</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>{form.id ? 'Modifier la note' : 'Ajouter une note'}</h3>
      <form onSubmit={handleSubmit} className="grade-form">
        <div className="form-group">
          <label>Étudiant :</label>
          <select name="etudiant_id" value={form.etudiant_id} onChange={handleChange} required>
            <option value="">-- Choisir un étudiant --</option>
            {etudiants.map(e => (
              <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Matière :</label>
          <select name="matiere" value={form.matiere} onChange={handleChange} required>
            <option value="">-- Choisir une matière --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.nom}>{m.nom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Note :</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="20"
            name="note"
            value={form.note}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          {form.id ? 'Modifier' : 'Ajouter'}
        </button>
        {form.id && (
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        )}
      </form>
    </div>
  );
}

export default ManageGrades;
