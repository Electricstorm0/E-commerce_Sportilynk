const produkController = require('../controller/produkController');

const routes = [
  {
    method: 'POST',
    path: '/add/produk',
    handler: produkController.createProduk,
  },
  {
    method: 'GET',
    path: '/produk',
    handler: produkController.getAllProduk,
  },
  {
    method: 'GET',
    path: '/produk/{id}',
    handler: produkController.getProdukById,
  },
  {
    method: 'PUT',
    path: '/produk/{id}',
    handler: produkController.updatedProduk,
  },
  {
    method: 'DELETE',
    path: '/produk/{id}',
    handler: produkController.deletedProduk,
  },
];

module.exports = routes;
