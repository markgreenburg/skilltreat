'use strict';

/**
 * User Routes - mounted at /api
 */
const router = require('express').Router();
const db = require('../models/index');
const config = require('../config/config.js');
const mailer = require('../mailer/mailer');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authenticate');

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
                        + result.verificationToken
            });
        }).then(() => {
            res
                .status(200)
                .json({
                    message: "Created user. Email verification required.",
                    data: {
                        fName: newUser.fName,
                        lName: newUser.lName,
                        email: newUser.email,
                        verificationExpires: newUser.verificationExpires,
                        isVerified: newUser.isVerified,
                        isSuspended: newUser.isSuspended
                    },
                    success: true,
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

// TO-DO: Auto-login on verification
// TO-DO: New endpoint for blacklisting a 'verify' token
/* Verify Account Email */
router.get('/user/verify', (req, res, next) => {
    db.user
        .findOne({where: {verificationToken: req.query.token} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error('Token Not Found'));
            }
            const now = new Date();
            if (now > result.verificationExpires) {
                return Promise.reject(new Error('Token Expired'));
            }
            result.isVerified = true;
            return result.save()
        }).then((verifiedUser) => {
            res
                .status(200)
                .json({
                    message: "User validated",
                    data: {
                        email: verifiedUser.email,
                        isVerified: verifiedUser.isVerified
                    },
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Login */
router.post('/user/login', (req, res, next) => {
    const authError = new Error("Authentication Failed");
    if (
            typeof req.body.email === 'undefined'
            || typeof req.body.password === 'undefined'
            || req.body.email === null
            || req.body.password === null 
    ) {
        return next(new Error("DB Error: username and password required"));
    }
    let foundUser = {};
    db.user
        .findOne({ where: {email: req.body.email} })
        .then((result) => {
            if (!result) {
                return Promise.reject(authError);
            }
            if (!result.isVerified) {
                return Promise.reject(new Error("Account not verified"));
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
                { id: foundUser.id, email: foundUser.email, },
                config.jwtSecret,
                { expiresIn: "7 days" }
            );
            return db.token.create({
                token: authToken,
                type: "authenticate",
            });
        }).then((token) => {
            res
                .status(200)
                .json({
                    message: "Login Successful",
                    data: { token: token.token },
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Log Out [blacklists token] */
router.post('/user/:id/logout', auth.checkAuth, auth.revokeAuth, 
        (req, res, next) => {
    if (!req.params.id) {
        return next(new Error("DB Error: No user ID supplied"));
    }
    res
        .status(200)
        .json({
            message: "Token revoked",
            data: {},
            success: true
        });
});

/* Read */
router.get('/user/:id/load', auth.checkAuth, auth.isSelf, (req, res, next) => {
    if (!req.params.id) {
        return next(new Error("No user ID supplied"));
    }
    db.user
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                // TO-DO: set 404s for not found db resources
                return Promise.reject(new Error("User Not Found"));
            }
            res
                .status(200)
                .json({
                    message: "Found User",
                    data: {
                        id: result.id,
                        fName: result.fName,
                        lName: result.lName,
                        email: result.email,
                        isVerified: result.isVerified,
                        isSuspended: result.isSuspended
                    },
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Update */
router.post('/user/:id/update', auth.checkAuth, (req, res, next) => {
    const info = req.body;
    if ( typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("DB Error: id not supplied"));
    }
    db.user
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("User not found"));
            }
            // TO-DO: DRY out by iterating through all object's props
            if (typeof info.fName !== 'undefined' && info.fName !== null) {
                result.fName = info.fName;
            }
            if (typeof info.lName !== 'undefined' && info.lName !== null) {
                result.lName = info.lName;
            }
            if (typeof info.email !== 'undefined' && info.email !== null) {
                result.email = info.email;
            }
            if (typeof info.password !== 'undefined' 
                    && info.password !== null) {
                result.password = info.password;
            }
            return result.save();
        }).then((updatedUser) => {
            res
                .status(200)
                .json({
                    message: "User updated",
                    data: {
                        fName: updatedUser.fName,
                        lName: updatedUser.lName,
                        email: updatedUser.email,
                        password: "hidden"
                    },
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Delete [also blacklists token] */
router.post('/user/:id/delete', auth.checkAuth, auth.revokeAuth,
        (req, res, next) => {
    if (typeof req.params.id === undefined || req.params.id === null) {
        return next(new Error("No user ID supplied"));
    }
    db.user
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("User not found"));
            }
            return result.destroy();
        }).then(() => {
            res.status(200).json({
                message: "User permanently deleted",
                data: {},
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

module.exports = router;