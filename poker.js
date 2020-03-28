const http = require('http');
const express = require('express')
const WebSocket = require('ws');
const app = express()
const port = 8080

const storage = require('./lib/storage');


console.log("X:", storage)

app.use('/', express.static('www'))

app.get('/new', function (req, res) {
    var sid = storage.newSession();
    res.redirect('/sessions/' + sid);
});

app.get('/sessions/:sessionid', function (req, res) {
    res.send(storage.showCaseSession(req.params.sessionid))
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log("WS: Conneted!")

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Probably listening on ${port}`)
})
