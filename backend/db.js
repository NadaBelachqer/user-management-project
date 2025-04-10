require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'user_management'
};

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connecté à MySQL.');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL
      )
    `);
    
    return connection;
  } catch (err) {
    console.error('Erreur MySQL:', err);
    process.exit(1);
  }
}

module.exports = { initializeDatabase };