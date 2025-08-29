const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const port = 3000;


const logStream = fs.createWriteStream('nodeapp.log', { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'cmdb'
};

const pool = mysql.createPool(dbConfig);

async function initDB() {
  try {
    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS servers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hostname VARCHAR(255) NOT NULL,
        ip_address VARCHAR(15) NOT NULL,
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    conn.release();
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

app.get('/api/servers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM servers');
    res.json(rows);
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
});

app.post('/api/servers', async (req, res) => {
  const { hostname, ip_address, role } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO servers (hostname, ip_address, role) VALUES (?, ?, ?)',
      [hostname, ip_address, role]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, async () => {
  await initDB();
  console.log(`CMDB API running on http://localhost:${port}`);
});
