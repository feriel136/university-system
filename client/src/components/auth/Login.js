import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      const user = response.data.user;
      const token = response.data.token;

      login(token, user);

      if (user.role === 'student') {
        navigate('/students/Dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teachers/Dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError("Rôle d'utilisateur inconnu.");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary">Se connecter</button>
        </form>
      
      </div>
    </div>
  );
}

export default Login;
