const express = require('express');
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const app = express();
const PORT = 8084;

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(path.resolve(__dirname, 'docs', 'index.html')));
});

app.use(express.static('docs'));

let cmd;
let isExit;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);

    cmd = exec(`lt --port ${PORT}`);

    cmd.stdout.on('data', (data) => {
        console.log(data);
    });

    cmd.stderr.on('data', (data) => {
        console.log(data);
    });
});

function onExit () {
    if (isExit) {
        return;
    }
    isExit = true;
    if (cmd) {
        cmd.kill('SIGINT');
        console.log('lt exit!');
    }
    console.log('server exit!');
    process.exit(0);
}

process.on('exit', onExit);
process.on('SIGINT', onExit);
