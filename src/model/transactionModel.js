const db = require('../config/database');

// Membuat transaksi baru
const createTransaction = async (id_user, total_amount) => {
  const query = 'INSERT INTO transactions (id_user, total_amount, status) VALUES (?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [id_user, total_amount, 'pending'], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to create transaction' });
      }
      resolve(result.insertId);
    });
  });
};

// Menambahkan item ke dalam transaksi
const addTransactionItem = async (id_transaction, id_produk, quantity, total_price) => {
  const query = 'INSERT INTO transaction_items (id_transaction, id_produk, quantity, total_price) VALUES (?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [id_transaction, id_produk, quantity, total_price], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to add transaction item' });
      }
      resolve(result);
    });
  });
};

// Mengosongkan keranjang setelah checkout
const clearCart = async (id_user) => {
  const query = 'DELETE FROM cart_items WHERE id_user = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id_user], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to clear cart' });
      }
      resolve(result);
    });
  });
};

// Mengambil item dari keranjang berdasarkan id_user
const getCartItemsByUser = async (id_user) => {
  const query = `
    SELECT ci.id_produk, ci.quantity, ci.total_price, p.price
    FROM cart_items ci
    JOIN product p ON ci.id_produk = p.id_produk
    WHERE ci.id_user = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [id_user], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to get cart items' });
      }
      resolve(result);
    });
  });
};

// kelola status
const updateTransactionStatus = (id_transaction, status) => {
  const query = 'UPDATE transactions SET status = ?, updatedAt = NOW() WHERE id_transaction = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [status, id_transaction], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to update status' });
      }
      resolve(result);
    });
  });
};

module.exports = { createTransaction, addTransactionItem, clearCart, getCartItemsByUser, updateTransactionStatus };
