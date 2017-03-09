const express = require('express');
const app = express();

// User routes
const user = require('./routes/user');
app.use('/api', user);

app.listen(3000);