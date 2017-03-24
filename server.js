'use strict';

const express = require('express');
const app = express();

/* Eventual Session Management Settings for WebApp */
// const config = require("./config/config");
// const session = require('express-session');
// const timeOut = (1000 * 60 * 60 * 24); //24 hours
// const sess = {
//     secret: config.sessionSecret,
//     maxAge: timeOut,
//     cookie: {maxAge: timeOut}
// };

// Set public and view directories, view engine
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'hbs');

// Logging
const morgan = require('morgan');
app.use(morgan('dev'));

// Load request parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// User routes
const user = require('./routes/user');
app.use('/api', user);
// Elective routes
const elective = require('./routes/elective');
app.use('/api', elective);
// Venue routes
const venue = require('./routes/venue');
app.use('/api', venue);
// Cart routes
const cart = require('./routes/cart');
app.use('/api', cart);
// Order routes
const order = require('./routes/order');
app.use('/api', order);

// Generic error handler
app.use((err, req, res, next) => {
    console.log(err);
    res
        .json({
            message: "Request Failed",
            data: err,
            success: false
        });
});

// Test db connection and export
var models = require('./models/index');
const env = process.env.NODE_ENV || "development";
if (env == "development") {
    models.sequelize
        .sync({ force: false })
        .then(function() {
            console.log(process.env.NODE_ENV, " Environment running on 3000");
            app.listen(3000);
        }).catch((err) => {
            throw new Error(err);
        });
} else {
    models.sequelize
        .sync({ force: false })
        .then(function() {
            console.log(process.env.NODE_ENV, " Environment running on 3000");
            app.listen(3000);
        }).catch((err) => {
            throw new Error(err);
        });
}