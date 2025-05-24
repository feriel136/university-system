// Assurez-vous d'importer toutes les dépendances nécessaires
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth'); // Importer les fonctions du contrôleur

// Route de login
router.post('/login', login);  // <-- ici, login est une fonction qui gère la requête

// Route d'enregistrement
router.post('/register', register);  // <-- ici, register est une fonction qui gère la requête

module.exports = router;
