/**
 * User Routes - mounted at /api
 */
const router = require('express').Router();
const db = require('../models/index');
const config = require('../config/config.js');
const mailer = require('../mailer/mailer');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authenticate');
const Promise = require('bluebird');
const uuid = require('uuid/v4');

/* Create a new user */
router.post('/user/register', (req, res, next) => {
  // create new user
  let newUser = {};
  db.user
    .create({
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      password: req.body.password,
    }).then((result) => {
      newUser = result;
      // Send email with verification token
      return mailer.sendMail({
        from: config.verificationEmail.from,
        to: result.email,
        subject: config.verificationEmail.subject,
        text: config.verificationEmail.baseText
        + config.verificationEmail.baseUrl
        + result.verificationToken,
      });
    }).then(() => {
      res
        .status(200)
        .json({
          message: 'Created user. Email verification required.',
          data: {
            fName: newUser.fName,
            lName: newUser.lName,
            email: newUser.email,
            verificationExpires: newUser.verificationExpires,
            isVerified: newUser.isVerified,
            isSuspended: newUser.isSuspended,
          },
          success: true,
        });
    }).catch(err => next(err));
});

// TO-DO: Auto-login on verification
// TO-DO: New endpoint for blacklisting a 'verify' token
/* Verify Account Email */
router.get('/user/verify', (req, res) => {
  let foundUser = {};
  db.user
    .findOne({ where: { verificationToken: req.query.token } })
    .then((result) => {
      if (!result) {
        return Promise.reject(new Error('Token Not Found'));
      }
      foundUser = result;
      const now = new Date();
      if (now > result.verificationExpires) {
        return Promise.reject(new Error('Token Expired'));
      }
      result.isVerified = true;
      return result.save();
    }).then((verifiedUser) => {
      res.render('validated', { email: verifiedUser.email });
    }).catch(() => res.render('error', { id: foundUser.id }));
});

/* Refresh validation */
router.get('/user/:id/refresh', (req, res) => {
  db.user
    // Find user
    .findOne({ where: { id: req.params.id } })
    // Set new token
    .then((result) => {
      if (!result) {
        return Promise.reject(new Error('User not found'));
      }
      result.verificationToken = uuid();
      result.verificationExpires =
        new Date(Date.now() + (1000 * 60 * 60 * 24));
      return result.save();
      // Send another email
    }).then(updatedUser => mailer.sendMail({
      from: config.verificationEmail.from,
      to: updatedUser.email,
      subject: config.verificationEmail.subject,
      text: config.verificationEmail.baseText
      + config.verificationEmail.baseUrl
      + updatedUser.verificationToken,
    })).then(() => res.status(200).render('reverify'))
    .catch(() => res
      .status(500)
      .render('error'));
});

/* Login */
router.post('/user/login', (req, res, next) => {
  const authError = new Error('Authentication Failed');
  if (
    typeof req.body.email === 'undefined'
    || typeof req.body.password === 'undefined'
    || req.body.email === null
    || req.body.password === null
  ) {
    return next(new Error('DB Error: username and password required'));
  }
  let foundUser = {};
  return db.user
    .findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (!result) {
        return Promise.reject(authError);
      }
      if (!result.isVerified) {
        return Promise.reject(new Error('Account not verified'));
      }
      foundUser = result.dataValues;
      return result.authenticate(req.body.password);
    }).then((resolve) => {
      if (resolve !== true) {
        return Promise.reject(authError);
      }
      // FYI - JWT is bigly synchronous even though it allows a callback.
      // It's the most synchronous thing you've ever seen!
      const authToken = jwt.sign(
        { id: foundUser.id, email: foundUser.email, isAdmin: foundUser.isAdmin },
        config.jwtSecret,
        { expiresIn: '7 days' }
      );
      return db.token.create({
        token: authToken,
        type: 'authenticate',
      });
    }).then((token) => {
      res
        .status(200)
        .json({
          message: 'Login Successful',
          data: { token: token.token },
          success: true,
        });
    })
    .catch(err => next(err));
});

/* Log Out */
router.post('/user/logout', auth.checkAuth, (req, res) => {
  res
    .status(200)
    .json({
      message: 'Token revoked',
      data: {},
      success: true,
    });
});

/* Read */
router.get('/user/load', auth.checkAuth, (req, res, next) => {
  db.user
    .findOne({ where: { id: req.jwtPayload.id } })
    .then((result) => {
      if (!result) {
        return Promise.reject(new Error('User Not Found'));
      }
      return res
        .status(200)
        .json({
          message: 'Found User',
          data: {
            id: result.id,
            fName: result.fName,
            lName: result.lName,
            email: result.email,
            isVerified: result.isVerified,
            isSuspended: result.isSuspended,
          },
          success: true,
        });
    }).catch(err => next(err));
});

/* Update */
router.post('/user/update', auth.checkAuth, (req, res, next) => {
  const info = req.body;
  db.user
    .findOne({ where: { id: req.jwtPayload.id } })
    .then((result) => {
      if (!result) {
        return Promise.reject(new Error('User not found'));
      }
      const userProperties = ['fName', 'lName', 'email', 'password'];
      userProperties.forEach((property) => {
        if (typeof info[property] !== 'undefined' && info[property] !== null) {
          result[property] = info[property];
        }
      });
      return result.save();
    }).then((updatedUser) => {
      res
        .status(200)
        .json({
          message: 'User updated',
          data: {
            fName: updatedUser.fName,
            lName: updatedUser.lName,
            email: updatedUser.email,
            password: 'hidden',
          },
          success: true,
        });
    }).catch(err => next(err));
});

/* Delete [also blacklists token] */
router.post('/user/delete', auth.checkAuth, auth.revokeAuth,
  (req, res, next) => {
    db.user
      .findOne({ where: { id: req.jwtPayload.id } })
      .then((result) => {
        if (!result) {
          return Promise.reject(new Error('User not found'));
        }
        return result.destroy();
      }).then(() => {
        res.status(200).json({
          message: 'User permanently deleted',
          data: {},
          success: true,
        });
      }).catch(err => next(err));
  });

module.exports = router;
