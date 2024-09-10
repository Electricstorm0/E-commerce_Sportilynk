const db = require('../config/database');
const bcrypt = require('bcrypt');

// get all user model
const getAllUser = async () => {
  const query = 'SELECT name, address, no_telp, email FROM user';
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to get data user' });
      }
      resolve(result);
    });
  });
};

// get uset by email untuk mendapatkan user menggunakan email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM user WHERE email=? ';
  return new Promise((resolve, reject) => {
    db.query(query, [email], async (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        return reject({ error: 'failed to login user' });
      }

      resolve(result);
    });
  });
};
// create user
const createUser = async (userData) => {
  const { name, address, no_telp, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10); // Meng-hash password dengan salt rounds = 10
  const query = 'INSERT INTO user (name, address, no_telp, email, password) VALUES (?, ?, ?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.query(query, [name, address, no_telp, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to register user' });
      }

      if (!result) {
        return reject({ error: 'No result returned from query' });
      }

      resolve({ id: result.insertId, ...userData });
    });
  });
};

// update user

const updatedUser = async (Id, userData) => {
  const { name, address, no_telp, email, password } = userData;

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10); // Meng-hash password baru jika diubah
  }

  const query = `
        UPDATE user
        SET name = ?, address = ?, no_telp = ?, email = ?, password = ?
        WHERE id_user = ?
    `;

  return new Promise((resolve, reject) => {
    db.query(query, [name, address, no_telp, email, hashedPassword, Id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to update user' });
      }

      resolve(result.affectedRows);
    });
  });
};

// delete user
const deletedUser = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM user WHERE id_user=?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to delete user' });
      }

      resolve(result.affectedRows);
    });
  });
};
module.exports = { getAllUser, findUserByEmail, createUser, updatedUser, deletedUser };
