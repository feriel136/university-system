import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AddSchedule.css';

function AddSchedule() {
  const [formData, setFormData] = useState({
    matiere_id: '',
    enseignant_id: '',
    jour: '',
    heure_debut: '',
    heure_fin: '',
    salle: ''
  });

  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEnseignants = await api.get('/enseignants');
        const resMatieres = await api.get('/matieres');
        setEnseignants(resEnseignants.data);
        setMatieres(resMatieres.data);
      } catch (err) {
        console.error('Erreur chargement des données :', err);
        setError("Impossible de charger les enseignants ou les matières.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/emplois_du_temps', formData);
      setSuccess(true);
      setFormData({
        matiere_id: '',
        enseignant_id: '',
        jour: '',
        heure_debut: '',
        heure_fin: '',
        salle: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur ajout emploi du temps:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="schedule-form-container">
      <h2>Ajouter un Emploi du Temps</h2>

      {success && <div className="alert alert-success">Ajouté avec succès !</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Matière:</label>
          <select name="matiere_id" value={formData.matiere_id} onChange={handleChange} required>
            <option value="">-- Choisir une matière --</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Enseignant:</label>
          <select name="enseignant_id" value={formData.enseignant_id} onChange={handleChange} required>
            <option value="">-- Choisir un enseignant --</option>
            {enseignants.map((e) => (
              <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Jour:</label>
          <input
            type="text"
            name="jour"
            value={formData.jour}
            onChange={handleChange}
            placeholder="ex: Lundi"
            required
          />
        </div>

        <div className="form-group">
          <label>Heure de début:</label>
          <input
            type="time"
            name="heure_debut"
            value={formData.heure_debut}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Heure de fin:</label>
          <input
            type="time"
            name="heure_fin"
            value={formData.heure_fin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Salle:</label>
          <input
            type="text"
            name="salle"
            value={formData.salle}
            onChange={handleChange}
            placeholder="ex: B202"
            required
          />
        </div>

        <button type="submit" className="btn-primary">Ajouter</button>
      </form>
    </div>
  );
}

export default AddSchedule;
