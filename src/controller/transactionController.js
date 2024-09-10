const { createTransaction, addTransactionItem, clearCart, getCartItemsByUser, updateTransactionStatus } = require('../model/transactionModel');

const checkout = async (request, h) => {
  const id_user = request.user.id_user;

  try {
    // Ambil item keranjang untuk pengguna
    const cartItems = await getCartItemsByUser(id_user);

    if (cartItems.length === 0) {
      return h.response({ success: false, message: 'Keranjang kosong' }).code(400);
    }

    // Hitung total amount
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += item.total_price;
    }

    // Buat transaksi baru
    const transactionId = await createTransaction(id_user, totalAmount);

    // Tambahkan item ke transaksi
    for (const item of cartItems) {
      await addTransactionItem(transactionId, item.id_produk, item.quantity, item.total_price);
    }

    // Kosongkan keranjang
    await clearCart(id_user);

    return h
      .response({
        statusCode: 201,
        success: true,
        message: 'Checkout successfully',
        transactionId: transactionId,
      })
      .code(201);
  } catch (error) {
    console.error('Error processing checkout:', error);
    return h.response({ statusCode: 500, success: false, message: 'Checkout gagal' }).code(500);
  }
};

// update status
const updateStatus = async (request, h) => {
  const { id_transaction, status } = request.payload;

  try {
    // Validasi status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
    if (!validStatuses.includes(status)) {
      return h
        .response({
          statusCode: 400,
          success: false,
          message: 'Invalid status value',
        })
        .code(400);
    }

    await updateTransactionStatus(id_transaction, status);
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'Transaction status updated successfully',
      })
      .code(200);
  } catch (error) {
    console.error('Error updating status:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: 'Failed to update transaction status',
      })
      .code(500);
  }
};

module.exports = { checkout, updateStatus };
