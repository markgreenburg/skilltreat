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
    db.user.create({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: req.body.password,
    }).then((result) => {
        // Send email with verification token
        mailer.sendMail({
            from: config.verificationEmail.from,
            to: result.email,
            subject: config.verificationEmail.subject,
            text: config.verificationEmail.baseText + config.verificationEmail.baseUrl 
                    + result.verificationToken
        // Send OK response
        }).then(() => {
            res.status(200).json({
                message: "Created user. Email verification required.",
                data: {
                    fName: result.fName,
                    lName: result.lName,
                    email: result.email,
                    verificationExpires: result.verificationExpires,
                    isVerified: result.isVerified,
                    isSuspended: result.isSuspended
                },
                success: true,
            });
        }).catch((err) => {
            console.log(err);
            return next(new Error('AWS SES Error'));
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error('DB Error: User Creation Failed'));
    });
});

// TO-DO: Auto-login on verification
router.get('/user/verify', (req, res, next) => {
    db.user.findOne({
        where: { verificationToken: req.query.token }
    }).then((result) => {
        if (!result) {
            return next(new Error('Validation Error: Token Not Found'));
        }
        const now = new Date();
        if (now > result.verificationExpires) {
            return next(new Error('Validation Error: Token Expired'));
        }
        result.isVerified = true;
        result.save().then(() => {
            res.status(200).json({
                message: "User validated",
                data: {
                    email: result.email,
                    isVerified: result.isVerified
                },
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(new Error('DB Error: Could not update user'));
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error('DB Error: Could not search for token'));
    });
});

/* Login */
router.post('/user/login', (req, res, next) => {
    const authError = new Error("Authentication Failed");
    if ( typeof req.body.email === 'undefined'
            || typeof req.body.password === 'undefined'
            || req.body.email === null
            || req.body.password === null 
    ) {
        return next(new Error("DB Error: username and password required"));
    }
    db.user.findOne({ where: {email: req.body.email} }).then((result) => {
        if (!result) {
            return next(authError);
        }
        if (!result.isVerified) {
            return next(new Error("Account not verified"));
        }
        result.authenticate(req.body.password).then((resolve) => {
            if (resolve !== true) {
                return next(authError);
            }
            // FYI - JWT is synchronous despite stupidly allowing a callback
            const authToken = jwt.sign({ id: result.id, email: result.email },
                    config.jwtSecret, { expiresIn: "7 days" });
            res.status(200).json({
                message: "Login Successful",
                data: { token: authToken },
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(authError);
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error("DB Error: could not finish user search"));
    });
});

/* Read */
router.get('/user/load', auth.checkAuth, auth.isSelf, (req, res, next) => {
    // Check which input given
    let sqlParams = {};
    if (req.query.id) {
        sqlParams = { id: req.query.id };
    } else if (req.query.email) {
        sqlParams = { email: req.query.email };
    } else {
        return next(new Error("DB Error: No search criteria supplied"));
    }
    db.user.findOne({ where: sqlParams }).then((result) => {
        if (!result) {
            // TO-DO: set 404s for not found db resources
            return next(new Error("User Not Found"));
        }
        res.status(200).json({
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
        return next(new Error("DB Error: Could not search for user"));
    });
});

/* Update */
router.post('/user/:id/update', auth.checkAuth, auth.isSelf, (req, res, next) => {
    const info = req.body;
    if ( typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("DB Error: id not supplied"));
    }
    db.user.findOne({ where: {id: req.params.id} }).then((result) => {
        if (!result) { return next(new Error("User not found")); }
        // Only set attributes that are passed in through req.body
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
        if (typeof info.password !== 'undefined' && info.password !== null) {
            result.password = info.password;
        }
        result.save().then(() => {
            res.status(200).json({
                message: "User updated",
                data: {
                    fName: result.fName,
                    lName: result.lName,
                    email: result.email,
                    password: "hidden"
                },
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(new Error("DB Error: Could not update user info"));
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error("DB Error: Could not complete user search"));
    });
});

/* Delete */
router.post('/user/:id/delete', auth.checkAuth, auth.isSelf, (req, res, next) => {
    if (typeof req.params.id === undefined || req.params.id === null) {
        return next(new Error("No user ID supplied"));
    }
    db.user.findOne({ where: {id: req.params.id} }).then((result) => {
        if (!result) return next(new Error("User not found"));
        result.destroy().then(() => {
            res.status(200).json({
                message: "User permanently deleted",
                data: {},
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(new Error("DB Error: could not destroy record"));
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error("DB Error: could not complete user search"));
    });
});

module.exports = router;