const userController = require('../controller/userController');

const routes = [
  {
    method: 'POST',
    path: '/register/user',
    handler: userController.createUser,
  },
  {
    method: 'GET',
    path: '/user',
    handler: userController.getAllUser,
  },
  {
    method: 'POST',
    path: '/login/user',
    handler: userController.loginUserByEmail,
  },
  {
    method: 'GET',
    path: '/protected/user',
    handler: (request, h) => {
      const user = request.user;

      return h
        .response({
          message: 'Protected data accessed',
          user: user,
        })
        .code(200);
    },
  },
  {
    method: 'GET',
    path: '/profile/user',
    handler: (request, h) => {
      const user = request.user;

      return h
        .response({
          message: 'User list accessed by',
          user: user,
        })
        .code(200);
    },
  },
  {
    method: 'PUT',
    path: '/user/{id}',
    handler: userController.updatedUser,
  },
  {
    method: 'DELETE',
    path: '/user/{id}',
    handler: userController.deletedUser,
  },
];

module.exports = routes;
