'use strict';

const express = require('express');
const app = express();

// Logging
const morgan = require('morgan');
app.use(morgan('dev'));

// Load request parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// User routes
const user = require('./routes/user');
app.use('/api', user);

// Test db connection and export
var models = require('./models/index');
const env = process.env.NODE_ENV || "development";
if (env == "development") {
    models.sequelize.sync({ force: true })
        .then(function() {
            app.listen(3000);
        }).catch((err) => {
            throw new Error(err);
        });
} else {
    app.listen(3000);
}