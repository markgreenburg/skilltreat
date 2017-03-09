const config = require('./config');
const express = require('express');
const app = express();

/* Initialize DB connection & pool */
// 0. Pull in sequelize
const Sequelize = require('sequelize');
// 1. Set active DB
const db = config.dev;
// 2. Config & initialize db connection
const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: db.dialect,
    pool: db.pool,
    port: db.port
});
// 3. Test the db connection and log output
sequelize
    .authenticate()
    .then(() => console.log("connection to db established"))
    .catch((err) => console.log("error connecting to db: ", err));

// User routes
const user = require('./routes/user');
app.use('/api', user);

app.listen(3000);