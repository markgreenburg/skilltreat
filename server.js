const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("I'm alive!");
});

app.listen(3000);