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

app.get('/sessions/:sessionid.json', function (req, res) {
    var content = storage.showCaseSession(req.params.sessionid);
    // In case we want to look at a session that doesn't exist
    if (false === content) {
        res.redirect('/');
        return;
    }

    res.send(storage.showCaseSession(req.params.sessionid))
});

app.get('/sessions/:sessionid', function (req, res) {
    var content = storage.showCaseSession(req.params.sessionid);
    // In case we want to look at a session that doesn't exist
    if (false === content) {
        storage.newSession(req.params.sessionid);

        // res.redirect('/');
        // return;
    }

    res.sendFile(join(__dirname, 'www/session.html'))

    // res.send(storage.showCaseSession(req.params.sessionid))
});


app.get('/sessions/:sessionid/:participantname', function (req, res) {
    res.sendFile(join(__dirname, 'www/player.html'))
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// for ws broadcast
const broadcastGroups = new Map();

wss.on('connection', function connection(ws, request) {

    const url = request.url;

    // /sessions/dev123/ben
    const playerRE = /\/sessions\/(\w+)\/(\w+)$/
    const playerMatch = url.match(playerRE);
    if (playerMatch) {

        const session = playerMatch[1]
        const name = playerMatch[2]

        const connectionId = Math.random().toString(32);




        // TODO - user connected
        console.log("Enter: ", session, name, connectionId)

        var content = storage.addParticipant(session, connectionId, name);
        const group = broadcastGroups.get(session);
        if (group && content) {
            group.forEach(client => {
                client.send(JSON.stringify(content))
            })
        }


        ws.on("close", () => {
            // TODO - user left
            const sessData = storage.removeParticipant(session, connectionId);
            console.log("Leave:", session, name, connectionId)


            const group = broadcastGroups.get(session);
            if (group && sessData) {
                group.forEach(client => {
                    client.send(JSON.stringify(sessData))
                })
            }
        })


        ws.on('message', function incoming(message) {
            console.log('received: %s', session, name, connectionId, message);

            try {
                const rec = JSON.parse(message)


                // do the points
                if (!isFinite(rec.points)) {
                    throw new Error("where's the score at?", rec)
                }

                const sessData = storage.submitScore(session, connectionId, rec.points)

                console.log("BROADCAST", sessData)

                const group = broadcastGroups.get(session);
                if (group && sessData) {
                    group.forEach(client => {
                        client.send(JSON.stringify(sessData))
                    })
                }

            } catch (e) {
                console.log("ERR", e)
            }


        });

        return;
    }


    // /sessions/dev123/ben
    const sessionRE = /\/sessions\/(\w+)$/
    const sessionMatch = url.match(sessionRE);
    if (sessionMatch) {

        const session = sessionMatch[1]

        console.log("Enter Session: ", session)

        let group;
        if (broadcastGroups.has(session)) {
            group = broadcastGroups.get(session)
        } else {
            group = new Set();
            broadcastGroups.set(session, group)
        }
        group.add(ws);

        ws.on('message', (msg) => {
            rec = JSON.parse(msg)
            if (!rec.clearScores) {
                throw new Error('Clearscores wasn\'t there or was false!', rec)
            }
            console.log('Received clearscore for ' + session);

            const sessData = storage.clearScores(session)

            const group = broadcastGroups.get(session);
            if (group && sessData) {
                group.forEach(client => {
                    client.send(JSON.stringify(sessData))
                })
            }

        })

        ws.on("close", () => {
            console.log("Leave Session:", session)

            // clean up broadcast group
            group.delete(ws)
            if (group.size === 0) {
                broadcastGroups.delete(session)
            }
        })


        // send out the initial state

        const initial = storage.showCaseSession(session);
        if (initial) {
            ws.send(JSON.stringify(initial))
        }


    }
    // ws.send('something');
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Probably listening on ${port}`)
})
