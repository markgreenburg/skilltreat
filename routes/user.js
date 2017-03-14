'use strict';

/**
 * User Routes - mounted at /api
 */
const router = require('express').Router();
const db = require('../models/index');
const verifyEmail = require('../config/nodemailerConfig.js');
const mailer = require('../mailer/mailer');

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
            from: verifyEmail.from,
            to: result.email,
            subject: verifyEmail.subject,
            text: verifyEmail.baseText + verifyEmail.baseUrl 
                    + result.verificationToken
        // Send response through API
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

router.get('/user/verify', (req, res, next) => {
    console.log(req);
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

/* Read */
router.get('/user/load', (req, res, next) => {
    // Check which input given
    let sqlParams = {};
    if (req.query.id) {
        sqlParams = { id: req.query.id };
    } else if (req.query.email) {
        sqlParams = { email: req.query.email };
    } else {
        return next(new Error("DB Error: No search criteria supplied"));
    }
    console.log("sql params:");
    console.log(sqlParams);
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

/* Update PII */
router.post('/user/:id/update/info', (req, res) => {
    res.send("update user PII route");
});

/* Update Password */
router.post('/user/:id/update/password', (req, res) => {
    res.send("update user password route");
});

/* Delete */
router.post('/user/:id/delete', (req, res) => {
    res.send("delete user route");
});

module.exports = router;