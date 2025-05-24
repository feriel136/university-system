import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AddSubject.css';

function AddSubject() {
  const [formData, setFormData] = useState({
    nom: '',
    enseignant_id: '',
    specialite: ''
  });

  const [enseignants, setEnseignants] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const res = await api.get('/enseignants');
        setEnseignants(res.data);
      } catch (err) {
        console.error('Erreur chargement enseignants', err);
      }
    };
    fetchEnseignants();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/matieres', formData);
      setSuccess(true);
      setFormData({ nom: '', enseignant_id: '', specialite: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="add-subject-form">
      <h2>Ajouter une Matière</h2>
      {success && <div className="alert alert-success">Ajout réussi !</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom :</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Enseignant :</label>
          <select name="enseignant_id" value={formData.enseignant_id} onChange={handleChange} required>
            <option value="">-- Choisir un enseignant --</option>
            {enseignants.map(e => (
              <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Spécialité :</label>
          <input type="text" name="specialite" value={formData.specialite} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-primary">Ajouter</button>
      </form>
    </div>
  );
}

export default AddSubject;
