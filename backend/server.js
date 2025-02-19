const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

client.connect()
    .then(() => {
        console.log('✅ Connecté à PostgreSQL');
        return client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                city VARCHAR(100) NOT NULL
            );
        `);
    })
    .then(() => {
        console.log("✅ Table 'users' prête !");
    })
    .catch(err => console.error('Erreur de connexion à la base de données :', err.stack));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', async (req, res) => {
    const { firstName, lastName, email, city } = req.body;
    if (!firstName || !lastName || !email || !city) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }
    try {
        const result = await client.query(
            'INSERT INTO users (firstName, lastName, email, city) VALUES ($1, $2, $3, $4) RETURNING id',
            [firstName, lastName, email, city]
        );
        res.json({ id: result.rows[0].id, firstName, lastName, email, city });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
