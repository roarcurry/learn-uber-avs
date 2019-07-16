import {APOLLO_SOCKET_HOST, APOLLO_SOCKET_PORT, MESSAGE_TYPE} from '../constants';
import {Converter} from "./converter";

const WebSocket = require('ws');

export class WSC {
    constructor(vehicleNo) {
        this.client = new WebSocket('ws://' + APOLLO_SOCKET_HOST + ':' + APOLLO_SOCKET_PORT + '/ws');

        // converter
        this.converter = new Converter(vehicleNo);

        this.client.on('open', () => {
            console.log('vehicleNo: ' + vehicleNo + " socket established!");

            const data = {
                'vehicleNo': vehicleNo
            };
            this.client.send(JSON.stringify(data));
        });

        this.client.on('message', message =>{
            const data = JSON.parse(message);

            if(data.vehicleNo === vehicleNo){
                const type = data.type;
                this.converter.convertPose(data.timestamp, {}, {});

                switch(type){
                    case 'chassis':
                        // console.log(data);
                        break;
                    case 'localization':
                        // console.log(data);
                        break;
                    default:
                        // console.log(type);
                        break;
                }
            }
        });
    }
}






