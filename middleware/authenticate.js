'use strict';
/**
 * Authentication middleware for JSON web tokens
 */
//TO-DO: integrate multiple permission types
// TO-DO: Add admin check
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../models/index');

const checkAuth = (req, res, next) => {
    const token = req.body.token 
            || req.query.token || req.headers['x-access-token'];
    const authError = new Error("Authentication Failed");
    if (!token) {
        return next(authError);
    }
    db.token
        .findOne({ 
            where: { token: token, revoked: false } 
        }).then((result) => {
            if (!result) {
                return Promise.reject(authError);
            }
            // JWT is synchronous. If verification fails, throws err
            jwt.verify(token, config.jwtSecret, (err, result) => {
                if (err) {
                    console.log(err);
                    return next(authError);
                }
                req.jwtPayload = result;
                return next();
            });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
};

const revokeAuth = (req, res, next) => {
    const token =
            req.body.token
            || req.query.token
            || req.headers['x-access-token'];
    db.token
        .findOne({ where: { token: token} })
        .then((result) => {
            if (!result) {
                return Promise.reject("Token Not Found");
            }
            result.revoked = true;
            return result.save();
        }).then(() => {
            return next();
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
};

const isAdmin = (req, res, next) => {
    const auth = req.jwtPayload;
    const authError = new Error("Not Authorized");
    if (typeof auth.isAdmin === 'undefined' || auth.isAdmin === null) {
        return next(authError);
    }
    if (auth.isAdmin === true) {
        return next();
    }
    return next(authError);
}

/* Ensures actions being performed on own account */
// TO-DO: Clarify id inputs to ensure they don't step on each other
const isSelf = (req, res, next) => {
    const auth = req.jwtPayload;
    const authError = new Error("Not Authorized");
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
}

module.exports = {
    checkAuth: checkAuth,
    revokeAuth: revokeAuth,
    isAdmin: isAdmin,
    isSelf: isSelf,
};