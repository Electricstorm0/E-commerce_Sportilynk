const userModel = require('../model/userModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// get all user controller
const getAllUser = async (request, h) => {
  try {
    const data = await userModel.getAllUser();
    if (!data || data.length === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'user not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'get user data successfully',
        data,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response(
      {
        statusCode: 500,
        success: false,
        message: error.error || 'Internal Server Error',
      }.code(500)
    );
  }
};

// find user by email
const secret = process.env.SECRET;
const loginUserByEmail = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const data = await userModel.findUserByEmail(email, password);
    if (data.length === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'User not found',
        })
        .code(404);
    }
    const user = data[0]; //mengambil data user pertama dari hasil query

    // compare password
    const match = await bcrypt.compare(password, user.password);
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
    const token = jwt.sign({ id_user: user.id_user, email: user.email, role: 'user' }, secret, {
      expiresIn: '1h',
    });

    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'Login successfully',
        user: user,
        token: token,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response(
      {
        statusCode: 500,
        success: false,
        message: error.error || 'Internal Server Error',
      }.code(500)
    );
  }
};

// create user controller
const createUser = async (request, h) => {
  try {
    const data = await userModel.createUser(request.payload);
    return h
      .response({
        statusCode: 201,
        success: true,
        message: 'User registered successfully',
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

// update user
const updatedUser = async (request, h) => {
  try {
    const Id = request.params.id;
    const data = await userModel.updatedUser(Id, request.payload);
    if (data === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'user not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
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
// delete user
const deletedUser = async (request, h) => {
  try {
    const Id = request.params.id;
    const data = await userModel.deletedUser(Id);
    if (data === 0) {
      return h
        .response({
          statusCode: 404,
          success: false,
          message: 'user not found',
        })
        .code(404);
    }
    return h
      .response({
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
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
module.exports = { createUser, getAllUser, loginUserByEmail, updatedUser, deletedUser };
