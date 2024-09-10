const cartController = require('../controller/cartController');

const routes = [
  {
    method: 'GET',
    path: '/cart',
    handler: cartController.getCart,
  },

  {
    method: 'POST',
    path: '/cart',
    handler: cartController.addToCart,
  },
  {
    method: 'DELETE',
    path: '/cart/item',
    handler: cartController.removeFromCart,
  },
  {
    method: 'DELETE',
    path: '/cart',
    handler: cartController.clearCart,
  },
];

module.exports = routes;
