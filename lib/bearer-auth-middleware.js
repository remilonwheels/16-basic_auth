'use strict';

const debug = require('debug')('ayogram:bearer-auth-middleware');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer');

  let authHeader = req.headers.authorization;

  if (!authHeader) return next(createError(401, 'authorization header required'));

  let token = authHeader.split('Bearer ')[1];
  if (!token) return next(createError(401, 'token required'));

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return next(err);

    User.findOne({ findHash: decoded.token })
    .then( user => {
      req.user = user;
      next();
    })
    .catch( err => {
      next(createError(401, err.message));
    });
  });
};
