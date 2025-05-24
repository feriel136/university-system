import React, { useState } from 'react';
import axios from 'axios';
import './ListDocumnt.css';
function CourseDownloadButton({ courseId, filename }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Option 1: Lien direct (si les fichiers sont servis statiquement)
      // window.open(`/uploads/${filename}`, '_blank');
      
      // Option 2: Via l'API (meilleur contrôle)
      const response = await axios.get(`/api/documents/download/${filename}`, {
        responseType: 'blob', // Important pour les fichiers
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError('Échec du téléchargement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="download-container">
      <button 
        onClick={handleDownload}
        disabled={loading}
        className="download-btn"
      >
        {loading ? 'Téléchargement...' : 'Télécharger le cours (PDF)'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CourseDownloadButton;