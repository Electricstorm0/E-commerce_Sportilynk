const produkModel = require('../model/produkModel');

// create produk controller
const createProduk = async (request, h) => {
  try {
    const response = await produkModel.createProduk(request.payload);
    return h
      .response({
        statusCode: 201,
        success: true,
        message: 'add product successfully',
        response,
      })
      .code(201);
  } catch (error) {
    console.error('Error:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: error.error || 'Internal Server Error',
      })
      .code(500);
  }
};

// get all product
const getAllProduk = async (request, h) => {
  try {
    const data = await produkModel.getAllProduk();
    if (!data || data.length === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'product not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'get product data successfully',
        data,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: error.error || 'Internal Server Error',
      })
      .code(500);
  }
};

// get product by id controller
const getProdukById = async (request, h) => {
  const id = request.params.id;
  try {
    const data = await produkModel.getProdukById(id);
    if (!data || data.length === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'product not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'get product data successfully',
        data,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: error.error || 'Internal Server Error',
      })
      .code(500);
  }
};

// update data produk
const updatedProduk = async (request, h) => {
  const id = request.params.id;
  try {
    const data = await produkModel.updatedProduk(id, request.payload);
    if (data === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'product not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'data updated successfully',
        data,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: error.error || 'Internal Server Error',
      })
      .code(500);
  }
};

// delete product controller
const deletedProduk = async (request, h) => {
  const id = request.params.id;
  try {
    const data = await produkModel.deleteProduk(id);
    if (data === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'product not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'data deleted successfully',
        data,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h
      .response({
        statusCode: 500,
        success: false,
        message: error.error || 'Internal Server Error',
      })
      .code(500);
  }
};

module.exports = { createProduk, getAllProduk, getProdukById, updatedProduk, deletedProduk };
