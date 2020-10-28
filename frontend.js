/**
 * This is the basic front end UI
 */

if (process.env.NODE_ENV !== 'production') {
    // if we are running production, ifnore the .env file.
    require('dotenv').config()
}

// Set up some application runtime variables.
const appFullName = "PSaaS Demo Front End"
const appPort = 3800
const wssPort = 8989




// load up our dependancies....
const whoami = require('whoami-exec')
const moment = require('moment-timezone')
const WebSocket = require('ws')
const serviceUser = whoami()
const isMobile = require('is-mobile');
const path = require('path');
const express = require('express')
const app = express()

// Establish our web server to serve the webui folder.
app.use('/', express.static(__dirname + '/webui'));

// helper to check if user is on mobile.
async function checkMobile(req, res, next) {
    let userIsMobile = await isMobile()
    req.user.isMobile = userIsMobile
    return next()
}

// extablish a web socket server.
const wss = new WebSocket.Server({
    port: wssPort,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});
// create a broadcast mechanism so we can talk to all clients at once.
wss.broadcast = function broadcast(msg) {
    // console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};




//web socket handler
wss.on('connection', function connection(ws) {
    // let fh = myWs = ws
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        let packet = JSON.parse(message)
        if (packet.task) {
            switch (packet.task) {
                case "getVersion": {
                    console.log('ver', process.env.npm_package_version)
                }
                default: {
                    console.log("unknown WSS command....", message)
                }
            }
        }
        else {
            console.log("unknown WSS command....", message)
        }
    })

    ws.on('close', function close() {
        console.log('disconnected');
    });


});

// this line is a catch all for development, and will help isolate any stray error that has 
// not been trapped/catched.
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));


// start listeneting on ports and display a nice summary to the admin in console.
app.listen(appPort, () => {
    console.clear();
    console.log("========================================================================")
    console.log(`${appFullName} running on PORT ${appPort} as ${serviceUser} :  ${moment().format('HH:mm:ss')}`)
    console.log(`Web Socket Service running on PORT ${wssPort}`)
    console.log("using CORS(*)")

}
);