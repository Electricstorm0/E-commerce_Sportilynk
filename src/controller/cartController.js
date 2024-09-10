// const cartModel = require('../model/cartModel');

// // get cart by id_user controller

// const getCart = async (request, h) => {
//   if (!request.user || !request.user.id_user) {
//     return h
//       .response({
//         statusCode: 401,
//         success: false,
//         message: 'User not authenticated',
//       })
//       .code(401);
//   }

//   const id_user = request.user.id_user; // Mengambil id_user dari JWT

//   try {
//     const cart = await cartModel.getCartByIdUser(id_user);
//     if (!cart) {
//       return h
//         .response({
//           statusCode: 404,
//           success: false,
//           message: 'Cart not found',
//         })
//         .code(404);
//     }

//     const cartItems = await cartModel.getCartItems(cart.id_cart);
//     return h
//       .response({
//         statusCode: 200,
//         success: true,
//         message: 'Cart items retrieved successfully',
//         data: cartItems,
//       })
//       .code(200);
//   } catch (error) {
//     console.error('Error retrieving cart:', error);
//     return h
//       .response({
//         statusCode: 500,
//         success: false,
//         message: 'Failed to retrieve cart',
//       })
//       .code(500);
//   }
// };

// const addToCart = async (request, h) => {
//   const id_user = request.user.id_user; // Mengambil id_user dari JWT
//   const { id_produk, quantity } = request.payload;

//   try {
//     const cart = await cartModel.getCartByIdUser(id_user);
//     if (!cart) {
//       return h
//         .response({
//           statusCode: 404,
//           success: false,
//           message: 'Cart not found',
//         })
//         .code(404);
//     }
//     await cartModel.addToCart(cart.id_cart, id_produk, quantity);
//     return h
//       .response({
//         statusCode: 201,
//         success: true,
//         message: 'Product added to cart',
//       })
//       .code(201);
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     return h
//       .response({
//         statusCode: 500,
//         success: false,
//         message: 'Failed to add product to cart',
//       })
//       .code(500);
//   }
// };

// const removeFromCart = async (request, h) => {
//   const id_user = request.user.id_user; // Mengambil id_user dari JWT
//   const { id_produk } = request.payload;

//   try {
//     const cart = await cartModel.getCartByIdUser(id_user);
//     if (!cart) {
//       return h
//         .response({
//           statusCode: 404,
//           success: false,
//           message: 'Cart not found',
//         })
//         .code(404);
//     }

//     await cartModel.removeFromCart(cart.id_cart, id_produk);
//     return h
//       .response({
//         statusCode: 200,
//         success: true,
//         message: 'Product removed from cart',
//       })
//       .code(200);
//   } catch (error) {
//     console.error('Error removing from cart:', error);
//     return h
//       .response({
//         statusCode: 500,
//         success: false,
//         message: 'Failed to remove product from cart',
//       })
//       .code(500);
//   }
// };

// const clearCart = async (request, h) => {
//   const id_user = request.user.id_user; // Mengambil id_user dari JWT

//   try {
//     const cart = await cartModel.getCartByIdUser(id_user);
//     if (!cart) {
//       return h
//         .response({
//           statusCode: 404,
//           success: false,
//           message: 'Cart not found',
//         })
//         .code(404);
//     }

//     await cartModel.clearCart(cart.id_cart);
//     return h
//       .response({
//         statusCode: 200,
//         success: true,
//         message: 'Cart cleared successfully',
//       })
//       .code(200);
//   } catch (error) {
//     console.error('Error clearing cart:', error);
//     return h
//       .response({
//         statusCode: 500,
//         success: false,
//         message: 'Failed to clear cart',
//       })
//       .code(500);
//   }
// };

// module.exports = {
//   getCart,
//   addToCart,
//   removeFromCart,
//   clearCart,
// };

const cartModel = require('../model/cartModel');

// Get cart by id_user controller
const getCart = async (request, h) => {
  if (!request.user || !request.user.id_user) {
    return h
      .response({
        statusCode: 401,
        success: false,
        message: 'User not authenticated',
      })
      .code(401);
  }

  const id_user = request.user.id_user; // Mengambil id_user dari JWT

  try {
    let cart = await cartModel.getCartByIdUser(id_user);
    if (!cart) {
      // Jika cart tidak ditemukan, buat cart baru
      const id_cart = await cartModel.createCart(id_user);
      cart = { id_cart }; // Menyusun objek cart dengan id_cart
    }

    const cartItems = await cartModel.getCartItemsByUserId(id_user);
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'Cart items retrieved successfully',
        data: cartItems,
      })
      .code(200);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: 'Failed to retrieve cart',
      })
      .code(500);
  }
};

const addToCart = async (request, h) => {
  const id_user = request.user.id_user; // Mengambil id_user dari JWT
  const { id_produk, quantity } = request.payload;

  try {
    // Periksa apakah cart ada
    let cart = await cartModel.getCartByIdUser(id_user);
    if (!cart) {
      // Jika cart tidak ada, buat cart baru
      const id_cart = await cartModel.createCart(id_user);
      cart = { id_cart };
    }

    await cartModel.addToCart(id_user, id_produk, quantity);
    return h
      .response({
        statusCode: 201,
        success: true,
        message: 'Product added to cart',
      })
      .code(201);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: `Failed to add product to cart,${error}`,
      })
      .code(500);
  }
};

const removeFromCart = async (request, h) => {
  const id_user = request.user.id_user; // Mengambil id_user dari JWT
  const { id_produk } = request.payload;

  try {
    // Periksa apakah cart ada
    let cart = await cartModel.getCartByIdUser(id_user);
    if (!cart) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'Cart not found',
        })
        .code(404);
    }

    await cartModel.removeFromCart(id_user, id_produk);
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'Product removed from cart',
      })
      .code(200);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: 'Failed to remove product from cart',
      })
      .code(500);
  }
};

const clearCart = async (request, h) => {
  const id_user = request.user.id_user; // Mengambil id_user dari JWT

  try {
    // Periksa apakah cart ada
    let cart = await cartModel.getCartByIdUser(id_user);
    if (!cart) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'Cart not found',
        })
        .code(404);
    }

    await cartModel.clearCart(id_user);
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'Cart cleared successfully',
      })
      .code(200);
  } catch (error) {
    console.error('Error clearing cart:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: 'Failed to clear cart',
      })
      .code(500);
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
