const express = require('express');
const app = express();
const authRoutes = require('./routes/auth'); // Importation des routes d'authentification

// Middleware pour parser le body en JSON
app.use(express.json());

// Utilisation des routes
app.use('/auth', authRoutes);  // <-- Assurez-vous que ce chemin est correct et que `authRoutes` est bien défini

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
