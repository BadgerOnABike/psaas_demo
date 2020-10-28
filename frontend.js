/**
 * This is the basic front end UI
 */



if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const appFullName = "PSaaS Demo Front End"
const appPort = 3800

const whoami = require('whoami-exec')
const moment = require('moment-timezone')
const WebSocket = require('ws')
const serviceUser = whoami()
const isMobile = require('is-mobile');
const path = require('path');
const express = require('express')

const app = express()


app.use('/', express.static(__dirname + '/webui'));


async function logUserEntry(req, res, next) {
    console.log('logUserEntry Tap')
    let user = await req.user
    console.table(user)

    return next()
}

async function checkMobile(req, res, next) {
    let userIsMobile = await isMobile()
    req.user.isMobile = userIsMobile
    return next()
}


const wss = new WebSocket.Server({
    port: 8989,
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
wss.broadcast = function broadcast(msg) {
    // console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};




//socket handler
wss.on('connection', function connection(ws) {
    let fh = myWs = ws
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        let packet = JSON.parse(message)


        if (packet.task) {
            switch (packet.task) {
                case "registerClient": {
                    let regData = packet.data
                    let playerId = regData.tempId


                    fs.writeFile(`./playerData/${playerId}.json`, JSON.stringify({}), function (err) {
                        if (err) {
                            return console.error(err)
                        }
                        else {
                            console.log('Client Registered.');
                        }


                    });



                }
                case 'getData': {
                    let fog = readSavedFog()
                        .then(fog => {
                            let gameData = {
                                tokenLibrary: builtInTokens,
                                party: getPartyData(),
                                fog: fog
                            }
                            wss.broadcast(JSON.stringify({
                                task: 'gameData',
                                gameData: gameData,
                                ts: Date.now()
                            }));
                        })

                    break;
                }
                case 'loadGameData': {
                    console.log("loading game data.... ")
                    getNewParty()
                        .then(newParty => {
                            console.log("New Party Data", newParty)
                            getPartyData()
                                .then(partyData => {
                                    readSavedFog()
                                        .then(fog => {
                                            let gameData = {
                                                tokenLibrary: builtInTokens,
                                                party: partyData,
                                                fog: fog,
                                                newParty: newParty
                                            }
                                            wss.broadcast(JSON.stringify({
                                                task: 'updateGameData',
                                                gameData: gameData,
                                                ts: Date.now()
                                            }));
                                        })
                                })

                        })






                    break;
                }

                case 'getNewParty': {
                    sendNewPartyUpdate()
                    break;
                }

                case 'sendGameMap': {
                    console.log("sending game map.... ")


                    wss.broadcast(JSON.stringify({
                        task: 'freshMapData',
                        mapData: playerMap,
                        ts: Date.now()
                    }));
                    break;
                }
                case 'removeToken': {

                    let tokenName = packet.data.name
                    let tokenId = packet.data.tokenId
                    console.log("removing Token Named", tokenName)
                    console.log("Token Data", packet.data)

                    //remove token from new party.
                    getNewParty()
                        .then(async party => {
                            console.log("party", party)
                            delete party[tokenId]
                            saveNewParty(party)
                                .then(() => {
                                    console.log("New party saved...")
                                    sendNewPartyUpdate()
                                })
                        })
                    wss.broadcast(JSON.stringify({
                        task: 'removeTokenFromClient',
                        tokenName: tokenName,
                        tokenId: tokenId,
                        ts: Date.now()
                    }));


                    // get party data
                    getPartyData()
                        .then(partyData => {
                            // filter out this toon.
                            let partyArray = Object.entries(partyData);
                            console.log("partyArray", partyArray)
                            // find the toon by name
                            partyArray.forEach(player => {
                                console.log("player", player)
                                let playerId = player[0]
                                let toons = player[1].toons

                                if (toons.length > 0) {
                                    console.log("Toons", toons)

                                    //toons.
                                    //toons.filter(subToon => subToon.charName === tokenName)

                                    if (toons.some(e => e.charName === tokenName)) {
                                        /* toons contains the token we're looking for */
                                        // now we remove the token from the player
                                        console.log("Before", partyData[playerId].toons)
                                        let playerUpdate = partyData[playerId].toons.filter(tObj => tObj.charName != tokenName)
                                        partyData[playerId].toons = playerUpdate
                                        console.log("After", partyData[playerId].toons)
                                        //xxx
                                        savePartyDataPromise(partyData)
                                            .then(() => {
                                                let gameData = {
                                                    tokenLibrary: builtInTokens,
                                                    party: partyData
                                                }
                                                wss.broadcast(JSON.stringify({
                                                    task: 'gameData',
                                                    gameData: gameData,
                                                    ts: Date.now()
                                                }));
                                            })


                                    }


                                }



                            })

                            // save party data

                            // broadcast party update.
                        })

                    break;
                }
                case 'saveGameData': {
                    console.log("Saving game data.... ")
                    let playerData = packet.data.local

                    getPartyData()
                        .then(partyData => {
                            if (partyData[playerData.tempId]) {
                                partyData[playerData.tempId].toons = playerData.toons

                                savePartyData(partyData)
                            }
                            else {
                                partyData[playerData.tempId] = {
                                    toons: playerData.toons
                                }
                                savePartyData(partyData)
                            }

                            let gameData = {
                                tokenLibrary: builtInTokens,
                                party: partyData
                            }
                            wss.broadcast(JSON.stringify({
                                task: 'gameData',
                                gameData: gameData,
                                ts: Date.now()
                            }));

                        })
                    break;
                }
                case 'sendFog': {
                    var fog = readSavedFog()
                        .then(fog => {
                            console.log("sending fog.... ")

                            wss.broadcast(JSON.stringify({
                                task: 'updateFog',
                                fogData: fog,
                                ts: Date.now()
                            }));
                        })

                    break;
                }
                case 'saveFog': {

                    console.log("saving new fog from DM.... ")
                    let poly = packet.fog
                    currentFog = poly
                    console.log('currentFog poly', currentFog)
                    saveAndBroadCastFog(currentFog)


                    //===============================


                    break;
                }


                // new token class functions

                case 'removeFromParty': {
                    let toon = packet.data.toon
                    console.log("Removing token from party.... ", toon)
                    // load current party
                    getNewParty()
                        .then(async party => {
                            console.log("party", party)
                            delete party[toon.tokenId]
                            saveNewParty(party)
                                .then(() => {
                                    console.log("Updated party saved...")
                                    removeTokenFromAll(toon)
                                })
                        })


                    break;
                }
                case 'addToParty': {
                    let toon = packet.data.toon
                    console.log("Adding token to party.... ", toon)
                    // load current party
                    getNewParty()
                        .then(async party => {
                            console.log("party", party)
                            party[toon.tokenId] = await toon
                            saveNewParty(party)
                                .then(() => {
                                    console.log("New party saved...")
                                    sendNewPartyUpdate()
                                })
                        })


                    break;
                }
                case 'updateToken': {
                    let toon = packet.data.toon
                    console.log("Updating token in party.... ", toon)
                    // load current party
                    getNewParty()
                        .then(async party => {
                            console.log("party", party)
                            party[toon.tokenId] = await toon
                            saveNewParty(party)
                                .then(() => {
                                    console.log("New party saved...")
                                    sendNewPartyUpdate()
                                })
                        })


                    break;
                }

                default: {
                    console.log("unknown WSS command....", message)
                }
            }

        }
        else {
            console.log("unknown WSS command....", message)
        }



        // ws.send(JSON.stringify({ task: 'reload fog', ts: Date.now() }));
    })

    ws.on('close', function close() {
        console.log('disconnected');
    });


});


process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

//app.listen(3100)
app.listen(appPort, () => {
    console.clear();
    console.log("========================================================================")
    console.log(`${appFullName} running on PORT ${appPort} as ${serviceUser} :  ${moment().format('HH:mm:ss')}`)
    console.log("using CORS(*)")

}
);