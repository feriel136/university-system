import React, { useState } from 'react';
import api from '../../services/api'; // axios configuré avec baseURL

import './AddTeacher.css';

function AddTeacher() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    departement: '',
    specialite: '' // ✅ Nouveau champ
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/enseignants', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess(true);
      setError('');
      setFormData({ nom: '', prenom: '', email: '', departement: '', specialite: '' }); // ✅ reset complet
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
      setSuccess(false);
    }
  };

  return (
    <div className="teacher-form-container">
      <h2>Ajouter un Enseignant</h2>

      {success && <div className="alert alert-success">Enseignant ajouté avec succès !</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom:</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Prénom:</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Département:</label>
          <input type="text" name="departement" value={formData.departement} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Spécialité:</label> {/* ✅ nouveau champ visuel */}
          <input type="text" name="specialite" value={formData.specialite} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-primary">Ajouter</button>
      </form>
    </div>
  );
}

export default AddTeacher;
