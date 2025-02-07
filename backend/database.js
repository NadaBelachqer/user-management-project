const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
    } else {
        console.log(' Connecté à la base de données SQLite.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        city TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error(" Erreur lors de la création de la table :", err.message);
        } else {
            console.log("Table 'users' prête.");
        }
    });

    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification des utilisateurs :", err.message);
            return;
        }
        if (row.count === 0) {
            const insertUser = db.prepare(`INSERT INTO users (firstName, lastName, email, city) VALUES (?, ?, ?, ?)`);
            insertUser.run('Nada', 'Belachqer', 'nada@gmail.com', 'Temara');
            insertUser.run('Fatima', 'Laaroussi', 'fatima@gmail.com', 'Salé');
            insertUser.run('Meryem', 'Fehmi', 'meryem@example.com', 'Skhirat');
            insertUser.finalize();
            console.log("Données insérées avec succès.");
        }
    });
});

module.exports = db;
