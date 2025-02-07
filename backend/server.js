const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Récupérer tous les utilisateurs
 */
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

/**
 * Ajouter un utilisateur
 */
app.post('/users', (req, res) => {
    const { firstName, lastName, email, city } = req.body;
    
    if (!firstName || !lastName || !email || !city) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    db.run(
        'INSERT INTO users (firstName, lastName, email, city) VALUES (?, ?, ?, ?)',
        [firstName, lastName, email, city],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, firstName, lastName, email, city });
        }
    );
});

/**
 * Modifier un utilisateur
 */
app.put('/users/:id', (req, res) => {
    const { firstName, lastName, email, city } = req.body;
    const { id } = req.params;

    if (!firstName || !lastName || !email || !city) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    db.run(
        'UPDATE users SET firstName = ?, lastName = ?, email = ?, city = ? WHERE id = ?',
        [firstName, lastName, email, city, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }
            res.json({ message: "Utilisateur mis à jour avec succès." });
        }
    );
});

/**
 * Supprimer un utilisateur
 */
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }
        res.json({ message: "Utilisateur supprimé avec succès." });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
