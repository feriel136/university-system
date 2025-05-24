// server/db.js
const mysql = require('mysql2');

// Créer une connexion à la base de données
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Remplace par ton utilisateur MySQL
  password: 'root', // Remplace par ton mot de passe MySQL
  database: 'university_system' // Remplace par le nom de ta base de données
});

// Exporter la connexion pour pouvoir l'utiliser ailleurs dans ton projet
module.exports = pool.promise(); // Utilisation de promesses pour utiliser async/await
