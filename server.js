const Hapi = require('@hapi/hapi');
require('dotenv').config();
const userRoute = require('./src/routes/userRoute');
const adminRoute = require('./src/routes/adminRoute');
const produkRoute = require('./src/routes/produkRoute');
const cartRoute = require('./src/routes/cartRoute');
const transactionRoute = require('./src/routes/transactionRoute');
const { verifyToken } = require('./src/helper/authHelper'); // Update path if necessary
require('./src/config/database');

const secret = process.env.SECRET;

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route([...userRoute, ...adminRoute, ...produkRoute, ...cartRoute, ...transactionRoute]);

  // Global JWT verification using onPreHandler lifecycle method
  server.ext('onPreHandler', async (request, h) => {
    const { authorization } = request.headers;

    // Define protected routes
    const protectedRoutes = ['/cart', '/cart/item', '/profile', '/cart/checkout'];

    if (protectedRoutes.includes(request.path)) {
      if (!authorization) {
        return h.response({ error: 'Missing authorization header' }).code(401).takeover();
      }

      const token = authorization.split(' ')[1];

      try {
        const decoded = await verifyToken(token); // Use the verifyToken function
        request.user = decoded; // Attach decoded user data to request object
      } catch (err) {
        return h
          .response({ error: err.error || 'Invalid token' })
          .code(401)
          .takeover();
      }
    }

    return h.continue;
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
