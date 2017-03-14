'use strict';

/**
 * User Routes - mounted at /api
 */
const router = require('express').Router();
const db = require('../models/index');
const verifyEmail = require('../config/nodemailerConfig.js');
const mailer = require('../mailer/mailer');

/* Create a new user */
router.post('/user/register', (req, res) => {
    console.log("req body: ");
    console.log(req.body);
    // create new user
    db.user.create({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: req.body.password,
    }).then((user) => {
        // Send email
        console.log(user);
        mailer.sendMail({
            from: verifyEmail.from,
            to: user.email,
            subject: verifyEmail.subject,
            text: verifyEmail.baseText + verifyEmail.baseUrl 
                    + user.verificationToken
        }).then((response) => {
            console.log(response);
            res.status(200)
                .json({
                    message: "Created user",
                    data: user,
                    success: true,
                });
        }).catch((err) => {
            console.log(err);
            res.status(500)
                .json({
                    message: "Email verification error",
                    data: err,
                    success: false
                });
        });
    }).catch((err) => {
        console.log(err);
        res
            .status(500)
            .json({
                message: "user creation failed",
                data: err,
                success: false
            });
    });
});

/* Read */
router.get('/user/:id/load', (req, res) => {
    res.send("read user route");
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