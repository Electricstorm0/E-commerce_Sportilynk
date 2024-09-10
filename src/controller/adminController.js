const adminModel = require('../model/adminModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// create admin controller
const createAdmin = async (request, h) => {
  try {
    const data = await adminModel.createAdmin(request.payload);
    return h
      .response({
        statusCode: 201,
        success: true,
        message: 'Admin registered successfully',
        data,
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

// login admin controller
const secret = process.env.SECRET;
const loginAdminByEmail = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const data = await adminModel.findAdminByEmail(email, password);
    if (data.length === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'Admin not found',
        })
        .code(404);
    }
    const admin = data[0];

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return h
        .response({
          statusCode: 401,
          success: false,
          message: 'Invalid Password',
        })
        .code(401);
    }

    // generate jwt token
    const token = jwt.sign({ id: admin.Id_admin, email: admin.email, role: 'admin' }, secret, { expiresIn: '1h' });

    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'login successfully',
        user: admin,
        token: token,
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

// updated admin controller
const updatedAdmin = async (request, h) => {
  try {
    const Id = request.params.id;
    const data = await adminModel.updatedAdmin(Id, request.payload);
    if (data === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'Admin not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'Admin updated successfully',
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

// delete admin controller
const deletedAdmin = async (request, h) => {
  try {
    const Id = request.params.id;
    const data = await adminModel.deletedAdmin(Id);
    if (data === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'Admin not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'Admin deleted successfully',
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

module.exports = { createAdmin, updatedAdmin, deletedAdmin, loginAdminByEmail };
