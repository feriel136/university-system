const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const port = 3100;
const app = express();
app.use(cors());
app.use(express.json());

// Clé secrète pour JWT (à placer dans .env en production)
const SECRET_KEY = 'dev-secret';

// Connexion MySQL
let db;
(async () => {
  try {
    db = await mysql.createConnection({
host: 'host.docker.internal',
      user: 'root',
      password: 'root',
      database: 'gestion_universite'
    });
    console.log('✅ Connecté à la base de données MySQL');
  } catch (err) {
    console.error('❌ Erreur de connexion à MySQL :', err);
  }
})();

// Middleware pour vérifier que l’utilisateur est admin
const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// 🔐 Enregistrement utilisateur (open)
app.post('/register', async (req, res) => {
  try {
    const { email, password, nom, prenom, role } = req.body;
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (email, password, nom, prenom, role) VALUES (?, ?, ?, ?, ?)`;
    const values = [email, hashedPassword, nom, prenom, role];
    const [result] = await db.query(sql, values);
    res.status(201).json({
      user: { id: result.insertId, email, nom, prenom, role },
      message: 'Utilisateur enregistré avec succès'
    });
  } catch (err) {
    console.error("❌ Erreur dans /register :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔐 Connexion utilisateur (open)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }
    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.prenom,
        lastName: user.nom,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Erreur dans /login :', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
// Ajouter une note
app.post('/notes', async (req, res) => {
  try {
    const { etudiant_id, matiere, note } = req.body;
    await db.query(
      'INSERT INTO notes (etudiant_id, matiere, note) VALUES (?, ?, ?)',
      [etudiant_id, matiere, note]
    );
    res.status(201).json({ message: 'Note ajoutée avec succès' });
  } catch (err) {
    console.error('Erreur ajout note:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier une note existante
app.put('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { etudiant_id, matiere, note } = req.body;
    await db.query(
      'UPDATE notes SET etudiant_id = ?, matiere = ?, note = ? WHERE id = ?',
      [etudiant_id, matiere, note, id]
    );
    res.json({ message: 'Note modifiée avec succès' });
  } catch (err) {
    console.error('Erreur modification note:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer toutes les notes avec nom complet étudiant
app.get('/notes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        notes.id,
        notes.matiere,
        notes.note,
        CONCAT(etudiants.nom, ' ', etudiants.prenom) AS nom_etudiant,
        etudiants.id AS etudiant_id
      FROM notes
      JOIN etudiants ON notes.etudiant_id = etudiants.id
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Erreur récupération des notes:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Ajouter une présence
app.post('/presences', async (req, res) => {
  try {
    const { etudiant_id, matiere_id, date, present } = req.body;

    if (!etudiant_id || !matiere_id || !date || present === undefined) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    await db.query(
      'INSERT INTO presences (etudiant_id, matiere_id, date, present) VALUES (?, ?, ?, ?)',
      [etudiant_id, matiere_id, date, present]
    );
    res.status(201).json({ message: 'Présence ajoutée avec succès' });
  } catch (err) {
    console.error('Erreur ajout présence:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier une présence
app.put('/presences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { etudiant_id, matiere_id, date, present } = req.body;

    if (!etudiant_id || !matiere_id || !date || present === undefined) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const [result] = await db.query(
      'UPDATE presences SET etudiant_id = ?, matiere_id = ?, date = ?, present = ? WHERE id = ?',
      [etudiant_id, matiere_id, date, present, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Présence non trouvée' });
    }

    res.json({ message: 'Présence modifiée avec succès' });
  } catch (err) {
    console.error('Erreur modification présence:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer toutes les présences avec nom étudiant et nom matière
app.get('/presences', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        presences.id,
        presences.date,
        presences.present,
        etudiants.id AS etudiant_id,
        CONCAT(etudiants.nom, ' ', etudiants.prenom) AS nom_etudiant,
        matieres.id AS matiere_id,
        matieres.nom AS nom_matiere
      FROM presences
      JOIN etudiants ON presences.etudiant_id = etudiants.id
      JOIN matieres ON presences.matiere_id = matieres.id
      ORDER BY presences.date DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Erreur récupération présence:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer la liste des étudiants
app.get('/etudiants', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nom, prenom FROM etudiants ORDER BY nom');
    res.json(rows);
  } catch (err) {
    console.error('Erreur récupération étudiants:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer la liste des matières
app.get('/matieres', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nom FROM matieres ORDER BY nom');
    res.json(rows);
  } catch (err) {
    console.error('Erreur récupération matières:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// ➕ Ajouter un étudiant (ADMIN uniquement)
app.post('/etudiants', authAdmin, async (req, res) => {
  const { nom, prenom, email, specialite, groupe } = req.body; // bien récupérer specialite et groupe

  try {
    const [result] = await db.query(
      'INSERT INTO etudiants (nom, prenom, email, specialite, groupe) VALUES (?, ?, ?, ?, ?)', // il faut 5 placeholders
      [nom, prenom, email, specialite, groupe] // 5 valeurs dans le même ordre
    );

    res.status(201).json({ message: 'Étudiant ajouté', id: result.insertId });
  } catch (err) {
    console.error('Erreur ajout étudiant:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// ➕ Ajouter un enseignant (ADMIN uniquement)
app.post('/enseignants', authAdmin, async (req, res) => {
  const { nom, prenom, email, departement } = req.body; // ❌ supprimé specialite
  try {
    const [result] = await db.query(
      'INSERT INTO enseignants (nom, prenom, email, departement, role) VALUES (?, ?, ?, ?, ?)', // ❌ supprimé specialite
      [nom, prenom, email, departement, 'enseignant']
    );
    res.status(201).json({ message: 'Enseignant ajouté', id: result.insertId });
  } catch (err) {
    console.error('Erreur ajout enseignant:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/emplois_du_temps', authAdmin, async (req, res) => {
  const { enseignant_id, jour, heure_debut, heure_fin, salle, matiere_id } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO emplois_du_temps (enseignant_id, jour, heure_debut, heure_fin, salle, matiere_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [enseignant_id, jour, heure_debut, heure_fin, salle, matiere_id]
    );
    res.status(201).json({ message: 'Emploi du temps ajouté', id: result.insertId });
  } catch (err) {
    console.error('Erreur ajout emploi du temps:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
app.get('/enseignants', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM enseignants');
    res.json(rows);
  } catch (err) {
    console.error('Erreur chargement enseignants :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});app.get('/matieres', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM matieres');
    res.json(rows);
  } catch (err) {
    console.error('Erreur chargement matières :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// ➕ Ajouter une matière avec enseignant et spécialité
app.post('/matieres', async (req, res) => {
  const { nom, enseignant_id, specialite } = req.body;
  try {
    await db.query(
      'INSERT INTO matieres (nom, enseignant_id, specialite) VALUES (?, ?, ?)',
      [nom, enseignant_id, specialite]
    );
    res.status(201).json({ message: 'Matière ajoutée' });
  } catch (err) {
    console.error('Erreur ajout matière:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer tous les enseignants
app.get('/enseignants', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, nom, prenom, email, departement FROM enseignants');
    res.json(results);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des enseignants:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});// Récupérer tous les etudiants
app.get('/etudiants', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, nom, prenom, email, specialite , groupe FROM etudiants');
    res.json(results);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des etudiants:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/matieres', authAdmin, async (req, res) => {
  const { nom, enseignant_id, specialite } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO matieres (nom, enseignant_id, specialite, created_at)
       VALUES (?, ?, ?, NOW())`,
      [nom, enseignant_id, specialite]
    );

    res.status(201).json({ message: 'Matière ajoutée', id: result.insertId });
  } catch (err) {
    console.error('Erreur ajout matière:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Events
// ✅ GET : récupérer les événements
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date_event');
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /api/events :', err);
    res.status(500).json({ error: 'Erreur serveur (GET)' });
  }
});

// ✅ POST : ajouter un événement
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date_event, location } = req.body;
    await pool.query(
      'INSERT INTO events (title, description, date_event, location) VALUES (?, ?, ?, ?)',
      [title, description, date_event, location]
    );
    res.json({ message: 'Événement ajouté avec succès' });
  } catch (err) {
    console.error('Erreur POST /api/events :', err);
    res.status(500).json({ error: 'Erreur serveur (POST)' });
  }
});
// Invitations: exemple pour ajouter une invitation (à adapter selon ta gestion utilisateurs)
app.post('/invitations', async (req, res) => {
  const { event_id, user_id } = req.body;
  await pool.query('INSERT INTO invitations (event_id, user_id) VALUES (?, ?)', [event_id, user_id]);
  res.json({ message: 'Invitation sent' });
});

// Stages & projets
app.get('/internships_projects', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM internships_projects ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/internships_projects', async (req, res) => {
  const { title, description, student_id, supervisor_id, start_date, end_date } = req.body;
  await pool.query(
    'INSERT INTO internships_projects (title, description, student_id, supervisor_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, student_id, supervisor_id, start_date, end_date]
  );
  res.json({ message: 'Internship/Project added' });
});

// Configuration de l’upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// API pour upload de document
app.post('/api/documents', upload.single('file'), (req, res) => {
  const { type, student_id } = req.body;
  const filePath = req.file.filename;

  db.query(
    'INSERT INTO documents (student_id, type, file_path) VALUES (?, ?, ?)',
    [student_id, type, filePath],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ message: 'Document ajouté avec succès', id: result.insertId });
    }
  );
});

// API pour liste des documents
app.get('/api/documents', (req, res) => {
  db.query('SELECT * FROM documents', (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
  // Emploi du temps pour l'enseignant connecté
app.get('/emplois/enseignant/moi', authUser, async (req, res) => {
  const { role, nom, prenom } = req.user;

  // Vérifie si c’est bien un enseignant
  if (role !== 'enseignant') {
    return res.status(403).json({ message: "Accès réservé aux enseignants" });
  }

  const enseignantNomComplet = `${nom} ${prenom}`; // adapte selon ce que tu stockes dans ton token

  try {
    const [rows] = await db.query(
      'SELECT * FROM emplois WHERE enseignant = ? ORDER BY jour, heure_debut',
      [enseignantNomComplet]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur récupération emploi enseignant :', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Afficher emploi du temps - accessible aux enseignants et étudiants
app.get('/api/emplois', async (req, res) => {
  try {
    const { enseignant_id } = req.query;
    
    let query = `
      SELECT 
        e.id,
        e.matiere_id,
        e.jour,
        e.heure_debut,
        e.heure_fin,
        e.salle,
        e.enseignant_id,
        e.created_at,
        m.nom AS matiere_nom,
        CONCAT(ens.nom, ' ', ens.prenom) AS enseignant_nom
      FROM emplois_du_temps e
      JOIN matieres m ON e.matiere_id = m.id
      JOIN enseignants ens ON e.enseignant_id = ens.id
    `;

    let params = [];
    if (enseignant_id) {
      query += ' WHERE e.enseignant_id = ?';
      params.push(enseignant_id);
    }

    query += ' ORDER BY e.jour, e.heure_debut';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/emplois/moi', authTeacher, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        e.id,
        e.matiere_id,
        e.jour,
        e.heure_debut,
        e.heure_fin,
        e.salle,
        e.created_at,
        m.nom AS matiere_nom
      FROM emplois_du_temps e
      JOIN matieres m ON e.matiere_id = m.id
      WHERE e.enseignant_id = ?
      ORDER BY e.jour, e.heure_debut`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/emplois', authAdmin, async (req, res) => {
  try {
    const { enseignant_id, matiere_id, jour, heure_debut, heure_fin, salle } = req.body;
    
    if (!enseignant_id || !matiere_id || !jour || !heure_debut || !heure_fin || !salle) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const [result] = await db.query(
      `INSERT INTO emplois_du_temps 
        (enseignant_id, matiere_id, jour, heure_debut, heure_fin, salle) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [enseignant_id, matiere_id, jour, heure_debut, heure_fin, salle]
    );

    res.status(201).json({ 
      message: 'Cours ajouté à l\'emploi du temps',
      id: result.insertId 
    });
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/enseignant/:id/upload-cours', upload.single('cours'), (req, res) => {
  const { title } = req.body;
  const filePath = req.file.filename;
  const enseignantId = req.params.id;

  const query = 'INSERT INTO cours (titre, fichier, enseignant_id) VALUES (?, ?, ?)';
  db.query(query, [title, filePath, enseignantId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Cours uploadé avec succès' });
  });
});
app.post('/enseignant/:id/ratrapage', (req, res) => {
  const { matiere_id, date, message } = req.body;
  const enseignantId = req.params.id;

  const query = 'INSERT INTO ratrapage (matiere_id, date, message, enseignant_id) VALUES (?, ?, ?, ?)';
  db.query(query, [matiere_id, date, message, enseignantId], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // ❗ Ici on peut aussi envoyer une notif aux étudiants concernés
    // Par exemple via une table notifications

    res.json({ message: 'Rattrapage déclaré avec succès' });
  });
});
// après ajout rattrapage
const notif = "Un rattrapage est prévu pour votre matière. Consultez vos événements.";
const getEtudiantsQuery = 'SELECT id FROM etudiant WHERE specialite = (SELECT specialite FROM enseignant WHERE id = ?)';
db.query(getEtudiantsQuery, [enseignantId], (err, students) => {
  if (!err) {
    students.forEach(etud => {
      db.query('INSERT INTO notification (etudiant_id, contenu) VALUES (?, ?)', [etud.id, notif]);
    });
  }
});

});




// 🔁 Port du serveur

app.get('/', (req, res) => {
  res.send('Backend Node.js dans Docker fonctionne !');
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

