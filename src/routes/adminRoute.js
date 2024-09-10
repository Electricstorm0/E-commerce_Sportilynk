const adminController = require('../controller/adminController');

const routes = [
  {
    method: 'POST',
    path: '/register/admin',
    handler: adminController.createAdmin,
  },
  {
    method: 'POST',
    path: '/login/admin',
    handler: adminController.loginAdminByEmail,
  },
  {
    method: 'GET',
    path: '/protected/admin',
    handler: (request, h) => {
      const admin = request.admin;

      return h
        .response({
          message: 'Protected data accessed',
          user: admin,
        })
        .code(200);
    },
  },
  {
    method: 'GET',
    path: '/profile/admin',
    handler: (request, h) => {
      const admin = request.admin;

      return h
        .response({
          message: 'User list accessed by',
          user: admin,
        })
        .code(200);
    },
  },
  {
    method: 'PUT',
    path: '/admin/{id}',
    handler: adminController.updatedAdmin,
  },
  {
    method: 'DELETE',
    path: '/admin/{id}',
    handler: adminController.deletedAdmin,
  },
];

module.exports = routes;
