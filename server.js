const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(path.resolve(__dirname, 'docs', 'index.html')));
});

app.use(express.static('docs'));

app.listen(8084, () => console.log('App listening on port 8084!'));
