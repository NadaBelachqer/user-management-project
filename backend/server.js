const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

// Connexion à PostgreSQL
const client = new Client({
    user: 'postgres',  
    host: 'localhost',
    database: 'user_management', 
    password: 'owyu350793', 
    port: 5432,  
});

client.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.stack);
    } else {
        console.log('Connecté à la base de données PostgreSQL.');
    }
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', [], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result.rows);
    });
});

app.post('/users', (req, res) => {
    const { firstName, lastName, email, city } = req.body;
    
    if (!firstName || !lastName || !email || !city) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    const insertQuery = 'INSERT INTO users (firstName, lastName, email, city) VALUES ($1, $2, $3, $4) RETURNING id';
    client.query(insertQuery, [firstName, lastName, email, city], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const { id } = result.rows[0];
        res.json({ id, firstName, lastName, email, city });
    });
});

app.put('/users/:id', (req, res) => {
    const { firstName, lastName, email, city } = req.body;
    const { id } = req.params;

    if (!firstName || !lastName || !email || !city) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    const updateQuery = 'UPDATE users SET firstName = $1, lastName = $2, email = $3, city = $4 WHERE id = $5';
    client.query(updateQuery, [firstName, lastName, email, city, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }
        res.json({ message: "Utilisateur mis à jour avec succès." });
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    client.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }
        res.json({ message: "Utilisateur supprimé avec succès." });
    });
});

app.get('/users/search', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Aucune requête de recherche fournie." });
    }

    const searchQuery = `%${query}%`;
    client.query(
        'SELECT * FROM users WHERE firstName LIKE $1 OR lastName LIKE $1 OR email LIKE $1 OR city LIKE $1',
        [searchQuery],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(result.rows);
        }
    );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
