'use strict';

const express = require('express');
const app = express();

/* Logging */
const morgan = require('morgan');
app.use(morgan('dev'));

// User routes
const user = require('./routes/user');
app.use('/api', user);

// Test db connection and export
var models = require('./models/index');
models.sequelize.sync()
    .then(function() {
        app.listen(3000);
    }).catch((err) => {
        throw new Error(err);
    });