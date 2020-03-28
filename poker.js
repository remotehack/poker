const http = require('http');
const express = require('express')
const WebSocket = require('ws');
const { join } = require('path')
const app = express()
const port = 8080

const storage = require('./lib/storage');


app.use('/', express.static('www'))

app.get('/new', function (req, res) {
    var sid = storage.newSession();
    res.redirect('/sessions/' + sid);
});

app.get('/sessions/:sessionid', function (req, res) {
    var content = storage.showCaseSession(req.params.sessionid);
    // In case we want to look at a session that doesn't exist
    if (false === content) {
        res.redirect('/');
        return;
    }

    res.sendFile(join(__dirname, 'www/session.html'))

    // res.send(storage.showCaseSession(req.params.sessionid))
});

app.get('/sessions/:sessionid/:participantname', function (req, res) {
    var content = storage.addParticipant(req.params.sessionid, req.params.participantname);
    if (false === content) {
        res.redirect('/');
        return;
    }

    res.sendFile(join(__dirname, 'www/player.html'))

    // res.send(content);
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, request) {

    // /sessions/dev123/ben
    const url = request.url;
    const re = /\/sessions\/(\w+)\/(\w+)$/
    const match = url.match(re);
    if (match) {
        // console.log("match", match);

        const session = match[1]
        const name = match[2]

        const userId = Math.random().toString(32);

        // TODO - user connected
        console.log("Enter: ", session, name, userId)


        ws.on("close", () => {
            // TODO - user left

            console.log("Leave:", session, name, userId)
        })

    }



    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    // ws.send('something');
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Probably listening on ${port}`)
})
