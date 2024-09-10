const db = require('../config/database');

// cretae produk
const createProduk = async (productData) => {
  const { name, description, category, brand, size, price, stock, image_url } = productData;
  const query = 'INSERT INTO product (name, description, category, brand, size, price, stock, image_url) VALUE (?,?,?,?,?,?,?,?)';
  return new Promise((resolve, reject) => {
    db.query(query, [name, description, category, brand, size, price, stock, image_url], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to add produk' });
      }
      if (!result) {
        return reject({ error: 'No result returned from query' });
      }
      resolve({ id: result.insertId, ...productData });
    });
  });
};

// get all produk
const getAllProduk = async () => {
  const query = 'SELECT * FROM product';
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to get data product' });
      }
      resolve(result);
    });
  });
};

// get product by id
const getProdukById = async (id) => {
  const query = 'SELECT * FROM product WHERE id_produk =?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: `Failed to get data product with id ${id}` });
      }
      resolve(result);
    });
  });
};

// update produk
const updatedProduk = async (id, productData) => {
  const { name, description, category, brand, size, price, stock, image_url } = productData;
  const query = 'UPDATE product SET name=?, description=?, category=?, brand=?, size=?, price=?, stock=?, image_url=? WHERE id_produk = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [name, description, category, brand, size, price, stock, image_url, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: `Failed to update data` });
      }
      resolve(result.affectedRows);
    });
  });
};

// delete produk
const deleteProduk = async (id) => {
  const query = 'DELETE FROM product WHERE id_produk=?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: `Failed to delete data` });
      }
      resolve(result.affectedRows);
    });
  });
};

module.exports = { createProduk, getAllProduk, getProdukById, updatedProduk, deleteProduk };
