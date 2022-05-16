import express = require('express');

const app : express.Application = express();

app.get('/', (req, res) => {
    res.send('First Express and node.js app!!');
});

app.listen(3000, () => {
    console.log('Demo app listenning on port 8080');
});