import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OfficialDocuments.css';

const OfficialDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/api/official-documents');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const uploadDocument = async () => {
    if (!file) return alert('Veuillez sélectionner un fichier');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      await axios.post('/api/official-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null);
      setDescription('');
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="official-docs-container">
      <h2 className="official-docs-title">Documents Officiels</h2>

      <div>
        <h3 className="official-docs-subtitle">Ajouter un document</h3>
        <input type="file" onChange={handleFileChange} className="official-docs-file-input" />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="official-docs-text-input"
        />
        <button onClick={uploadDocument} className="official-docs-button">Uploader</button>
      </div>

      <hr className="official-docs-hr" />

      <div>
        <h3 className="official-docs-subtitle">Liste des documents</h3>
        <ul className="official-docs-list">
          {documents.map(doc => (
            <li key={doc.id} className="official-docs-list-item">
              <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                {doc.description || 'Document sans description'}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OfficialDocuments;
