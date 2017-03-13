'use strict';

/**
 * User Routes - mounted at /api
 */
const router = require('express').Router();
const db = require('../models/index');
const mailer = require('../mailer/mailer');
const Promise = require('bluebird');
const sendMail = Promise.promisify(mailer.sendMail, mailer);

/* Create a new user */
router.post('/user/register', (req, res) => {
    db.User.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
    }).then((user) => {
        // Create unique link
        const verifyURL = "http://localhost:3000/api/user/verify?token=" + user.token;
        // Send email
        sendMail({
            from: "mark@markgreenburg.com",
            to: user.email,
            subject: "Welcome! Please verify your account",
            text: "Please verify your email before using Skilltreat by clicking"
                    + " the following link or copy and pasting it into your"
                    + " browser: " + verifyURL
        })
        // Send response with user data
    }).catch((err) => {
        // Send response with error details
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