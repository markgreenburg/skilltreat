'use strict';
/**
 * Authentication middleware for JSON web tokens
 */
//TO-DO: integrate multiple permission types
// TO-DO: Add admin check
const secret = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.body.token 
            || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return next(new Error("Authentication Failed"));
    }
    jwt.verify(token, secret, (err, result) => {
        if (err) {
            console.log(err);
            return next(new Error("Authentication Failed"));
        }
        req.jwtPayload = result;
        return next();
    });
};

/* Ensures actions being performed on own account */
const isSelf = (req, res, next) => {
    const auth = req.jwtPayload;
    const authError = new Error("Authentication Failed");
    if ((typeof auth.id === 'undefined' || auth.id === null)
            && (typeof auth.email === 'undefined' || auth.email === null)) {
        return next(authError);
    }
    const idToEdit = req.body.id || req.query.id || req.params.id;
    const emailToEdit = req.body.email || req.query.email || req.params.email;
    if (!idToEdit && !emailToEdit) {
        return next(authError);
    }
    if (auth.id === idToEdit || auth.email === emailToEdit) {
        return next();
    }
    return next(new Error("User does not have permission for this action"));
}

module.exports = {
    checkAuth: checkAuth,
    isSelf: isSelf
};