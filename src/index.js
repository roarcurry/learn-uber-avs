import {APOLLO_SOCKET_HOST, APOLLO_SOCKET_PORT, APOLLO_SOCKET_NAME, APOLLO_VEHICLE_NUMBER, MESSAGE_TYPE} from './constants';

const WebSocket = require('ws');

/**
 * server
 * @type {WebSocketServer}
 */
const server = new WebSocket.Server({
    port: 8090
});

server.on('connection', (socket, req) => {
    console.log("Connection Established!" + req.url);

    // socket.send('123', ()=>{
    //     console.log(456);
    // });

    socket.on('message', (message) => {
        const data = JSON.parse(message);

    });
});

server.on('message', (message) => {
    console.log(message);
});


/**
 * client
 * @type {WebSocket}
 */
const client = new WebSocket('ws://' + APOLLO_SOCKET_HOST + ':' + APOLLO_SOCKET_PORT + '/ws');

client.on('open', () => {
    console.log(APOLLO_VEHICLE_NUMBER + " socket established!");

    const data = {};
    data[APOLLO_SOCKET_NAME] = APOLLO_VEHICLE_NUMBER;

    // console.log(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on('message', message =>{
    const data = JSON.parse(message);

    if(data.vehicleNo === APOLLO_VEHICLE_NUMBER){
        const type = data.type;

        switch(type){
            case 'cidiv2x':
                // console.log(data);
                break;
            case 'chasis':
                // console.log(data);
                break;
            default:
                // console.log(type);
                break;
        }
    }else {
        // console.log(data);

    }


});

