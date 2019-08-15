import {Worker} from "../utils/worker";

import {POINTCLOUD, DURATION} from "../constants";

const WebSocket = require('ws'); // https://github.com/websockets/ws/blob/master/doc/ws.md#event-connection

export class WSC {
    constructor(session, options, params, reqType) {
        this.session = session;
        this.options = options;
        this.params = params;
        this.reqType = reqType;

        this.worker = new Worker(session);

        this.client = null;

        if(reqType === POINTCLOUD){
            this.url = `ws://${this.params.host}:${this.params.port}/pointcloud`;
        }else{
            this.url = `ws://${this.params.host}:${this.params.port}/websocket`;
        }


        this.socketData = {type: this.reqType};
        this.timer = null;
        this.duration = DURATION;
    }

    connect() {
        this.client = new WebSocket(this.url);
        // this.client.binaryType = 'arraybuffer';

        this.client.on('open', () => {
            this.onOpen();
        });
        this.client.on('close', () => {
            this.onClose();
        });
        this.client.on('error', error =>{
            this.onError(error);
        });
        this.client.on('message', message =>{
            this.onMessage(message);
        });
    }

    onOpen() {
        this.log(`[> Socket Client] open: ${this.socketData.type}`);
        this.timer = setInterval(() => {this.client.send(JSON.stringify(this.socketData))}, this.duration);
    }

    onClose() {
        this.log(`[> Socket Client] close: ${this.socketData.type}`);
        setTimeout(()=> {this.connect();}, 1000);
    }

    onError(error) {
        this.log(error.toString());
    }

    onMessage(message){
        this.worker.onMessage({type:this.reqType, data:message});
    }

    log(...msg) {
        const {logger} = this.options;
        if (logger && logger.log) {
            logger.log(...msg);
        }
    }
}






