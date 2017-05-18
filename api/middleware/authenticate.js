/**
 * Authentication middleware for JSON web tokens
 */
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../models/index');

const checkAuth = (req, res, next) => {
  const token =
    req.body.token
    || req.query.token
    || req.headers['x-access-token'];
  const authError = new Error('Authentication Failed');
  if (!token) { return next(authError); }
  return db.token
    .findOne({
      where: { token, revoked: false },
    }).then((result) => {
      if (!result) {
        return Promise.reject(authError);
      }
      // JWT is synchronous. If verification fails, throws err
      return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
          return next(authError);
        }
        req.jwtPayload = decoded;
        return next();
      });
    }).catch(err => next(err));
};

const revokeAuth = (req, res, next) => {
  const token =
    req.body.token
    || req.query.token
    || req.headers['x-access-token'];
  db.token
    .findOne({ where: { token } })
    .then((jwtResult) => {
      if (!jwtResult) {
        return Promise.reject('Token Not Found');
      }
      jwtResult.revoked = true;
      return jwtResult.save();
    }).then(() => next())
    .catch(err => next(err));
};

const isAdmin = (req, res, next) => {
  const auth = req.jwtPayload;
  const authError = new Error('Not Authorized');
  if (typeof auth.isAdmin === 'undefined' || auth.isAdmin === null) {
    return next(authError);
  }
  if (auth.isAdmin === true) {
    return next();
  }
  return next(authError);
};

/* Ensures actions being performed on own account */
// TO-DO: Clarify id inputs to ensure they don't step on each other
const isSelf = (req, res, next) => {
  const auth = req.jwtPayload;
  const authError = new Error('Not Authorized');
  if (
    (typeof auth.id === 'undefined' || auth.id === null)
    || (typeof req.params.id === 'undefined' || req.params.id === null)
  ) {
    return next(authError);
  }
  if (auth.id === req.params.id || auth.isAdmin === true) {
    return next();
  }
  return next(authError);
};

module.exports = {
  checkAuth,
  revokeAuth,
  isAdmin,
  isSelf,
};
