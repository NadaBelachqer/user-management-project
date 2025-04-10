require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Configuration CORS plus complète
app.use(cors({
    origin: 'http://localhost:3000', // Autorise uniquement votre frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Autorise ces méthodes
    allowedHeaders: ['Content-Type', 'Authorization'] // Autorise ces headers
}));

app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'user_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Création d'un pool de connexions
const pool = mysql.createPool(dbConfig);

// Vérification de la connexion à la base de données
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database!');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

// Initialisation de la table users
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                city VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        connection.release();
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initializeDatabase();

// Routes
// GET /api/users - Récupère tous les utilisateurs
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /api/users/search - Recherche des utilisateurs
app.get('/api/users/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ? OR city LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ error: 'Search failed' });
    }
});

// POST /api/users - Crée un nouvel utilisateur
app.post('/api/users', async (req, res) => {
    const { firstname, lastname, email, city } = req.body;
    
    if (!firstname || !lastname || !email || !city) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO users (firstname, lastname, email, city) VALUES (?, ?, ?, ?)',
            [firstname, lastname, email, city]
        );
        
        const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        res.status(201).json(newUser[0]);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT /api/users/:id - Met à jour un utilisateur
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, city } = req.body;

    if (!firstname || !lastname || !email || !city) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Vérifie d'abord si l'utilisateur existe
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Met à jour l'utilisateur
        const [result] = await pool.query(
            'UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ? WHERE id = ?',
            [firstname, lastname, email, city, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Récupère l'utilisateur mis à jour
        const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json(updatedUser[0]);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /api/users/:id - Supprime un utilisateur
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifie d'abord si l'utilisateur existe
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Supprime l'utilisateur
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Port d'écoute
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});