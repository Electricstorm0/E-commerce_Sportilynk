const db = require('../config/database');
const bcrypt = require('bcrypt');

// create admin model
const createAdmin = async (adminData) => {
  const { name, email, password } = adminData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO admin (name,email,password) VALUE(?,?,?) ';

  return new Promise((resolve, reject) => {
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to register admin' });
      }
      if (!result) {
        return reject({ error: 'No result returned from query' });
      }
      resolve({ id: result.insertId, ...adminData });
    });
  });
};

// find admin by email / login model for admin
const findAdminByEmail = async (email) => {
  const query = 'SELECT * FROM admin WHERE email=? ';
  return new Promise((resolve, reject) => {
    db.query(query, [email], async (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to login admin' });
      }
      resolve(result);
    });
  });
};

// updated admin
const updatedAdmin = async (Id, adminData) => {
  const { name, email, password } = adminData;
  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const query = 'UPDATE admin SET name=?,email=?,password=? WHERE Id_admin =?';

  return new Promise((resolve, reject) => {
    db.query(query, [name, email, hashedPassword, Id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to update admin data' });
      }
      resolve(result.affectedRows);
    });
  });
};

// delete admin
const deletedAdmin = async (id) => {
  const query = 'DELETE FROM admin WHERE Id_admin = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to delete admin data' });
      }
      resolve(result.affectedRows);
    });
  });
};

module.exports = { createAdmin, updatedAdmin, deletedAdmin, findAdminByEmail };
