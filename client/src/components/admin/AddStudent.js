import React, { useState } from 'react';
import api from '../../services/api';
import './AddStudent.css';

function AddStudent() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    specialite: '',
    groupe: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/etudiants', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccess(true);
      setError('');
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        specialite: '',
        groupe: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  return (
    <div className="student-form-container">
      <h2>Ajouter un Étudiant</h2>

      {success && <div className="alert alert-success">Étudiant ajouté avec succès!</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prénom :</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Spécialité :</label>
          <input
            type="text"
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Groupe :</label>
          <input
            type="text"
            name="groupe"
            value={formData.groupe}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary">Ajouter Étudiant</button>
      </form>
    </div>
  );
}

export default AddStudent;
