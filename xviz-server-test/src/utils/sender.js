import {SIMWORLD, UPDATESIMWORLD, CAMERA, UPDATECAMERA6mm, UPDATECAMERA25mm, POINTCLOUD, UPDATEPOINTCLOUD} from "../constants";
import {Converter} from "./xviz_converter";

export class Sender {
    constructor(session){
        this.session = session;
        this.context = this.session.context;

        this.dataPose = null;
        this.dataPoint = null;
        this.dataCam6mm = null;
        this.dataCam25mm = null;
    }

    check(){
        while(this.context.get(UPDATESIMWORLD) && this.context.get(UPDATESIMWORLD).length > 0){
            const converter = new Converter();

            this.dataPose = this.context.get(UPDATESIMWORLD).shift();
            converter.convertPose(this.dataPose);

            if(this.context.get(UPDATEPOINTCLOUD) && this.context.get(UPDATEPOINTCLOUD).length > 0){
                this.dataPoint = this.context.get(UPDATEPOINTCLOUD).shift();
                converter.convertPointCloud(this.dataPoint);
            }else if(this.dataPoint){
                converter.convertPointCloud(this.dataPoint);
            }

            if(this.context.get(UPDATECAMERA6mm) && this.context.get(UPDATECAMERA6mm).length > 0){
                this.dataCam6mm = this.context.get(UPDATECAMERA6mm).shift();
                converter.convertCamera(this.dataCam6mm);
            }else if(this.dataCam6mm){
                converter.convertCamera(this.dataCam6mm);
            }
            if(this.context.get(UPDATECAMERA25mm) && this.context.get(UPDATECAMERA25mm).length > 0){
                this.dataCam25mm = this.context.get(UPDATECAMERA25mm).shift();
                converter.convertCamera(this.dataCam25mm);
            }else if(this.dataCam25mm){
                converter.convertCamera(this.dataCam25mm);
            }


            this.sendMsg(converter.xvizBuilder.getMessage());
        }
    }

    sendMsg(msg) {
        if(this.session){
            this.session.handler.callMiddleware('just_send', msg);
        }
    }


}