const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const user = require('./routes/user');
const elective = require('./routes/elective');
const venue = require('./routes/venue');
const cart = require('./routes/cart');
const order = require('./routes/order');
const models = require('./models/index');

const app = express();

// Set public and view directories, view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set(`views/${__dirname}/public/views`);
app.set('view engine', 'hbs');

// Logging
app.use(morgan('dev'));

// Load request parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// User routes
app.use('/api', user);
// Elective routes
app.use('/api', elective);
// Venue routes

app.use('/api', venue);
// Cart routes

app.use('/api', cart);
// Order routes

app.use('/api', order);

// Generic error handler
app.use((err, req, res) => res.json({
  message: 'Request Failed',
  data: err,
  success: false,
}));

// Test db connection and export
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  models.sequelize
    .sync({ force: false })
    .then(() => {
      console.log(process.env.NODE_ENV, ' Environment running on 3000');
      app.listen(3000);
    }).catch((err) => {
      throw new Error(err);
    });
} else {
  models.sequelize
    .sync({ force: false })
    .then(() => {
      console.log(process.env.NODE_ENV, ' Environment running on 3000');
      app.listen(3000);
    }).catch((err) => {
      throw new Error(err);
    });
}
