const { checkout, updateStatus } = require('../controller/transactionController');

const routes = [
  {
    method: 'POST',
    path: '/cart/checkout',
    handler: checkout,
  },
  {
    method: 'PUT',
    path: '/status/updated',
    handler: updateStatus,
  },
];

module.exports = routes;
