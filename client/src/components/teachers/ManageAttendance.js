import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // adapte le chemin si besoin

function ManageAttendance() {
  const [presenceList, setPresenceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [etudiants, setEtudiants] = useState([]);
  const [matieres, setMatieres] = useState([]);

  const [form, setForm] = useState({
    id: null,
    etudiant_id: '',
    matiere_id: '',
    date: '',
    present: null,  // null au début
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presenceRes, etudiantsRes, matieresRes] = await Promise.all([
          api.get('/presences'),
          api.get('/etudiants'),
          api.get('/matieres'),
        ]);
        setPresenceList(presenceRes.data);
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
    const { name, value } = e.target;
    if (name === 'present') {
      setForm({
        ...form,
        present: value === 'present' ? true : false,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleEdit = (presence) => {
    setForm({
      id: presence.id,
      etudiant_id: presence.etudiant_id,
      matiere_id: presence.matiere_id,
      date: presence.date.slice(0, 10), // pour input date
      present: presence.present,
    });
  };

  const handleCancel = () => {
    setForm({
      id: null,
      etudiant_id: '',
      matiere_id: '',
      date: '',
      present: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.etudiant_id || !form.matiere_id || !form.date || form.present === null) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      if (form.id) {
        // Modifier
        await api.put(`/presences/${form.id}`, {
          etudiant_id: form.etudiant_id,
          matiere_id: form.matiere_id,
          date: form.date,
          present: form.present,
        });
        alert('Présence modifiée avec succès');
      } else {
        // Ajouter
        await api.post('/presences', {
          etudiant_id: form.etudiant_id,
          matiere_id: form.matiere_id,
          date: form.date,
          present: form.present,
        });
        alert('Présence ajoutée avec succès');
      }

      const res = await api.get('/presences');
      setPresenceList(res.data);
      handleCancel();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  if (loading) return <div>Chargement des présences...</div>;

  return (
    <div className="presence-container">
      <h2>Gérer les Présences</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Matière</th>
            <th>Date</th>
            <th>Présent</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {presenceList.length === 0 ? (
            <tr><td colSpan="5">Aucune présence trouvée.</td></tr>
          ) : (
            presenceList.map(presence => (
              <tr key={presence.id}>
                <td>{presence.nom_etudiant}</td>
                <td>{presence.nom_matiere}</td>
                <td>{presence.date.slice(0, 10)}</td>
                <td>{presence.present ? 'Présent' : 'Absent'}</td>
                <td>
                  <button onClick={() => handleEdit(presence)}>Modifier</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>{form.id ? 'Modifier présence' : 'Ajouter présence'}</h3>
      <form onSubmit={handleSubmit} className="presence-form">
        <div className="form-group">
          <label>Étudiant :</label>
          <select
            name="etudiant_id"
            value={form.etudiant_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Choisir un étudiant --</option>
            {etudiants.map(e => (
              <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Matière :</label>
          <select
            name="matiere_id"
            value={form.matiere_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date :</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Présence :</label>
          <select
            name="present"
            value={form.present === null ? '' : (form.present ? 'present' : 'absent')}
            onChange={handleChange}
            required
          >
            <option value="">-- Choisir --</option>
            <option value="present">Présent</option>
            <option value="absent">Absent</option>
          </select>
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

export default ManageAttendance;
