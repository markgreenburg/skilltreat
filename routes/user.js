'use strict';

/**
 * User Routes - mounted at /api
 */
const router = require('express').Router();

/* Create */
router.post('/user/register', (req, res) => {
    res.send("Create user route");
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