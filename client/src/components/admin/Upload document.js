import { useState } from 'react';
import axios from 'axios';

const UploadDocument = ({ studentId }) => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("CV");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("student_id", studentId);

    try {
      await axios.post("http://localhost:3100/api/documents", formData);
      alert("Document uploadé !");
    } catch (error) {
      console.error(error);
      alert("Erreur d’upload");
    }
  };

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="CV">CV</option>
        <option value="Rapport">Rapport</option>
        <option value="Convention">Convention</option>
      </select>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Uploader</button>
    </div>
  );
};

export default UploadDocument;
