import {APOLLO_SOCKET_HOST, APOLLO_SOCKET_PORT, MESSAGE_TYPE} from '../constants';
import {Converter} from "./converter";

const WebSocket = require('ws');

export class WSC {
    constructor(vehicleNo, session) {
        // this.client = new WebSocket('ws://' + APOLLO_SOCKET_HOST + ':' + APOLLO_SOCKET_PORT + '/ws');
        // this.client = new WebSocket('ws://172.16.34.236:8888/websocket'); // 测试用
        this.client = new WebSocket('ws://183.214.189.253:19006/ws'); // v2xmonitor

        this.session = session;

        // converter
        this.converter = new Converter(vehicleNo);

        this.client.on('open', () => {
            console.log('vehicleNo: ' + vehicleNo + " socket established!");

            const data = {
                // 'vehicleNo': vehicleNo
                'connectName': 'remoteMonitoring'
            };
            this.client.send(JSON.stringify(data));
        });

        this.client.on('message', message =>{
            const data = JSON.parse(message);

            // console.log(data.type);

            if(data.type == 'v2xInfo' && data.hv.plateNumber == vehicleNo){
                // console.log(data);
                // console.log(data.hv.v2v.heading);

                this.sendMsg(this.converter.convertPose(new Date().getTime(), {lon:data.hv.v2v.LONG, lat: data.hv.v2v.LAT, alt:0}, {roll:0, pitch:0, yaw:data.hv.v2v.heading}));
            }


            // if(data.vehicleNo === vehicleNo){
            //     const type = data.type;
            //
            //     this.sendMsg(this.converter.convertPose(data.timestamp, {}, {}));
            //
            //     switch(type){
            //         case 'chassis':
            //             // console.log(data);
            //             break;
            //         case 'localization':
            //             // console.log(data);
            //             break;
            //         default:
            //             // console.log(type);
            //             break;
            //     }
            // }
        });
    }

    sendMsg (msg){
        if(this.session){
            this.session.handler.callMiddleware('just_send', msg);
        }
    }
}






