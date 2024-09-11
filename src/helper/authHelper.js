require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// helper untuk verifikasi token

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject({ error: 'Invalid token' });
      }
      resolve(decoded);
    });
  });
};

module.exports = { verifyToken };
