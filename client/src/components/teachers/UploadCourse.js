import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';
import './UploadCourse.css';

function UploadCourse() {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Veuillez sélectionner un fichier PDF.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setMessage('Seuls les fichiers PDF sont acceptés.');
      return;
    }

    const formData = new FormData();
    formData.append('cours', file);

    try {
      setIsLoading(true);
      await api.post(`/enseignant/${user.profile.id}/upload-cours`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Cours uploadé avec succès !');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'upload. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-course-container">
      <h2>Uploader un Cours (PDF)</h2>
      
      <div className="file-input-wrapper">
        <label className="file-input-label">
          <FiUpload size={24} />
          <span>Glissez-déposez votre fichier ou</span>
          <strong>Parcourir les fichiers</strong>
          <input 
            type="file" 
            className="file-input"
            accept="application/pdf" 
            onChange={handleFileChange} 
          />
        </label>
      </div>

      {file && (
        <div className="file-info">
          <div>
            <FiFile style={{ marginRight: '8px' }} />
            {file.name} ({Math.round(file.size / 1024)} KB)
          </div>
          <FiX onClick={removeFile} />
        </div>
      )}

      <button 
        className="upload-button" 
        onClick={handleUpload}
        disabled={!file || isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            Upload en cours...
          </>
        ) : 'Uploader le cours'}
      </button>

      {message && (
        <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default UploadCourse;