const db = require('../config/database');

// Get cart by id_user
const getCartByIdUser = async (id_user) => {
  const query = 'SELECT * FROM cart WHERE id_user = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id_user], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to get cart' });
      }
      resolve(result[0]);
    });
  });
};

// Create new cart
const createCart = async (id_user) => {
  const query = 'INSERT INTO cart (id_user) VALUES (?)';
  return new Promise((resolve, reject) => {
    db.query(query, [id_user], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to create cart' });
      }
      resolve(result.insertId);
    });
  });
};

// Get cart items from cart by id_user
const getCartItemsByUserId = async (id_user) => {
  // Mengambil cart_id berdasarkan user_id
  const cart = await getCartByIdUser(id_user);
  if (!cart) return []; // Return empty array if no cart

  const query = `
    SELECT ci.id_cart_items, ci.quantity, ci.total_price, p.id_produk, p.name AS product_name, p.price AS product_price
    FROM cart_items ci
    JOIN product p ON ci.id_produk = p.id_produk
    WHERE ci.id_user = ?;
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [id_user], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to get items' });
      }
      resolve(result);
    });
  });
};

// Add items to cart
const addToCart = async (id_user, id_produk, quantity) => {
  return new Promise((resolve, reject) => {
    // Ambil detail produk berdasarkan id_product untuk validasi stok
    const queryProduct = 'SELECT price, stock FROM product WHERE id_produk = ?';
    db.query(queryProduct, [id_produk], (err, product) => {
      if (err) return reject(err);
      if (!product.length || product[0].stock < quantity) {
        return reject(new Error('Stock not available'));
      }

      const total_price = product[0].price * quantity;

      // Periksa apakah cart ada
      getCartByIdUser(id_user)
        .then((cart) => {
          if (!cart) {
            return createCart(id_user).then((id_cart) => {
              // Tambahkan item ke cart baru
              const query = 'INSERT INTO cart_items (id_user, id_produk, quantity, total_price) VALUES (?, ?, ?, ?)';
              db.query(query, [id_user, id_produk, quantity, total_price], (err, result) => {
                if (err) {
                  console.error('Error executing query:', err);
                  return reject({ error: 'Failed to add items' });
                }
                resolve(result);
              });
            });
          } else {
            // Tambahkan item ke cart yang sudah ada
            const query = 'INSERT INTO cart_items (id_user, id_produk, quantity, total_price) VALUES (?, ?, ?, ?)';
            db.query(query, [id_user, id_produk, quantity, total_price], (err, result) => {
              if (err) {
                console.error('Error executing query:', err);
                return reject({ error: 'Failed to add items' });
              }
              resolve(result);
            });
          }
        })
        .catch((err) => reject(err));
    });
  });
};

// Remove item from cart
const removeFromCart = (id_user, id_produk) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM cart_items WHERE id_user = ? AND id_produk = ?';
    db.query(query, [id_user, id_produk], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to delete items' });
      }
      resolve(result);
    });
  });
};

// Clear cart
const clearCart = (id_user) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM cart_items WHERE id_user = ?';
    db.query(query, [id_user], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return reject({ error: 'Failed to clear cart' });
      }
      resolve(result);
    });
  });
};

module.exports = { getCartByIdUser, createCart, getCartItemsByUserId, addToCart, removeFromCart, clearCart };
