const mysql = require('mysql'); //import mysql
require('dotenv').config();

// membuat koneksi
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Pastikan Anda mengisi password di .env
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Mengecek koneksi ke database
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1); // Keluar jika koneksi gagal
  }

  console.log('Connected to database');
  connection.release(); // Lepaskan koneksi kembali ke pool
});

// Export db untuk digunakan di bagian lain aplikasi
module.exports = db;
