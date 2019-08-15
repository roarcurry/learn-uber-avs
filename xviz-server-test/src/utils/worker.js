const protobuf = require("protobufjs/light");
const simWorldRoot = protobuf.Root.fromJSON(require("../proto_bundle/sim_world_proto_bundle.json"));
const SimWorldMessage = simWorldRoot.lookupType("apollo.dreamview.SimulationWorld");
const pointCloudRoot = protobuf.Root.fromJSON(require("../proto_bundle/point_cloud_proto_bundle.json"));
const pointCloudMessage = pointCloudRoot.lookupType("apollo.dreamview.PointCloud");

import {SIMWORLD, UPDATESIMWORLD, CAMERA, UPDATECAMERA6mm, UPDATECAMERA25mm, POINTCLOUD, UPDATEPOINTCLOUD} from "../constants";

export class Worker {
    constructor(session) {
        this.session = session;
    }

    onMessage(message){
        let data = null;
        switch(message.type){
            case SIMWORLD:
                if (typeof message.data === "string") {
                    try {
                        data = JSON.parse(message.data);
                    }catch (e) {
                        console.log(e);
                        break;
                    }
                } else {
                    try{
                        data = SimWorldMessage.toObject(
                            SimWorldMessage.decode(new Uint8Array(message.data)),
                            { enums: String });
                        data.type = UPDATESIMWORLD;
                    }catch (e) {
                        console.log(e);
                        break;
                    }
                }
                this.dataStorage(data);
                break;
            case CAMERA:
                try{
                    data = JSON.parse(message.data);
                }catch (e) {
                    console.log(e);
                    break;
                }
                this.dataStorage(data);
                break;
            case POINTCLOUD:
                if (typeof message.data === "string") {
                    try{
                        data = JSON.parse(message.data);
                    }catch (e) {
                        console.log(e);
                        break;
                    }
                } else {
                    try {
                        data = pointCloudMessage.toObject(
                            pointCloudMessage.decode(new Uint8Array(message.data)), {arrays: true});
                        data.type = UPDATEPOINTCLOUD;
                    }catch (e) {
                        console.log(e);
                        break;
                    }
                }
                this.dataStorage(data);
                break;
            default:
        }
    }

    dataStorage(data){
        if(this.session.context.get(data.type)){
            this.session.context.get(data.type).push(data);
        }else{
            this.session.context.set(data.type, [data]);
        }
    }


}