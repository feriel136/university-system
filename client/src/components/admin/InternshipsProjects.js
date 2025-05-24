import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InternshipsProjects.css';
const InternshipsProjects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'pending',
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/internships-projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users'); // for assigning projects
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = e => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const addProject = async () => {
    try {
      await axios.post('/api/internships-projects', newProject);
      setNewProject({ title: '', description: '', status: 'pending', assignedTo: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/internships-projects/${id}`, { status });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="internships-projects-container">
      <h2 className="internships-projects-title">Gestion des Stages et Projets</h2>

      <div className="internships-projects-add-section">
        <h3 className="internships-projects-subtitle">Ajouter un nouveau projet/stage</h3>
        <input
          className="internships-projects-input"
          type="text"
          name="title"
          placeholder="Titre"
          value={newProject.title}
          onChange={handleChange}
        />
        <textarea
          className="internships-projects-textarea"
          name="description"
          placeholder="Description"
          value={newProject.description}
          onChange={handleChange}
        />
        <select
          className="internships-projects-select"
          name="assignedTo"
          value={newProject.assignedTo}
          onChange={handleChange}
        >
          <option value="">Attribuer à...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button className="internships-projects-add-button" onClick={addProject}>Ajouter</button>
      </div>

      <hr className="internships-projects-divider" />

      <div className="internships-projects-list-section">
        <h3 className="internships-projects-subtitle">Liste des projets/stages</h3>
        <table className="internships-projects-table" cellPadding="5" border="1">
          <thead>
            <tr>
              <th className="internships-projects-th">Titre</th>
              <th className="internships-projects-th">Description</th>
              <th className="internships-projects-th">Statut</th>
              <th className="internships-projects-th">Assigné à</th>
              <th className="internships-projects-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(proj => (
              <tr key={proj.id} className="internships-projects-tr">
                <td className="internships-projects-td">{proj.title}</td>
                <td className="internships-projects-td">{proj.description}</td>
                <td className="internships-projects-td">{proj.status}</td>
                <td className="internships-projects-td">{proj.assignedToName || '-'}</td>
                <td className="internships-projects-td">
                  {proj.status !== 'validated' && (
                    <button
                      className="internships-projects-action-button validate"
                      onClick={() => updateStatus(proj.id, 'validated')}
                    >
                      Valider
                    </button>
                  )}
                  {proj.status !== 'pending' && (
                    <button
                      className="internships-projects-action-button pending"
                      onClick={() => updateStatus(proj.id, 'pending')}
                    >
                      Remettre en attente
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternshipsProjects;
