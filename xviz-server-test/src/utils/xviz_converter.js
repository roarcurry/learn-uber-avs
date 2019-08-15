import {XVIZBuilder, XVIZMetadataBuilder} from '@xviz/builder';
import {MemorySourceSink} from '@xviz/io';
import {XVIZData} from '@xviz/io';

import {UTMToWGS84} from "./coordinate_converter";


import {MetaData} from "./metaData";


export class Converter {
    constructor() {
        // this.xvizBuilder = new XVIZBuilder({metadata: MetaData});
        this.xvizBuilder = new XVIZBuilder();

    }


    convertPose(data){
        const timestamp = data.timestamp / 1000;
        const mapOrigin = UTMToWGS84(data.autoDrivingCar.positionX, data.autoDrivingCar.positionY).concat([0]); // [longitude, latitude, altitude]
        // const orientation = [0, 0].concat( [(450 - data.autoDrivingCar.heading) % 360 * Math.PI / 180] ); // [roll, pitch, yaw]
        const orientation = [0, 0].concat( [data.autoDrivingCar.heading] ); // [roll, pitch, yaw]

        this.xvizBuilder
            .pose('/vehicle_pose')
            .timestamp(timestamp)
            .mapOrigin(...mapOrigin)
            .position(0, 0, 0)
            .orientation(...orientation);


        const velocity = data.autoDrivingCar.speed;
        const acceleration = data.autoDrivingCar.speedAcceleration;
        const wheel_angle = data.autoDrivingCar.steeringAngle;

        this.xvizBuilder
            .timeSeries('/vehicle/velocity')
            .timestamp(timestamp)
            .value(velocity);
        this.xvizBuilder
            .timeSeries('/vehicle/acceleration')
            .timestamp(timestamp)
            .value(acceleration);
        this.xvizBuilder
            .timeSeries('/vehicle/wheel_angle')
            .timestamp(timestamp)
            .value(wheel_angle);


        for(let i=0; i<data.object.length; i++){
            const id = data.object[i].id;
            const type = data.object[i].type;
            const length = data.object[i].length;
            const width = data.object[i].width;
            const height = data.object[i].height;
            const origin = [data.object[i].positionX, data.object[i].positionY, 0];
            const heading = data.object[i].heading;

            const points = []; // object 底面的四个顶点，从目标点左下角按逆时针顺序
            for(let j=0; j<4; j++){
                switch (j){
                    case 0:
                        points[j] = [origin[0]-length/2, origin[1]+width/2, origin[2]];
                        break;
                    case 1:
                        points[j] = [origin[0]-length/2, origin[1]-width/2, origin[2]];
                        break;
                    case 2:
                        points[j] = [origin[0]+length/2, origin[1]-width/2, origin[2]];
                        break;
                    case 3:
                        points[j] = [origin[0]+length/2, origin[1]+width/2, origin[2]];
                        break;
                    default:
                }

                // 一点 (x1, y1) 绕另一点 (x0, y0) 旋转 a 度后的点的坐标公式 (x, y)
                const x = (points[j][0]-origin[0])*Math.cos(heading) - (points[j][1]-origin[1])*Math.sin(heading) + origin[0]; // x = (x1 - x0)*cos(a) - (y1 - y0)*sin(a) + x0 ;
                const y = (points[j][0]-origin[0])*Math.sin(heading) + (points[j][1]-origin[1])*Math.cos(heading) + origin[1]; // y = (x1 - x0)*sin(a) + (y1 - y0)*cos(a) + y0 ;
                points[j][0] = x;
                points[j][1] = y;
            }

            this.xvizBuilder
                .primitive('/tracklets/objects')
                .polygon(points)
                .style({
                    fill_color: '#08f',
                    height: height
                })
                .id(id);

            this.xvizBuilder
                .primitive('/tracklets/tracking_point')
                .circle(origin, width/3)
                .id(id);
        }
    }


    convertPointCloud(data){
        this.xvizBuilder
            .primitive('/lidar/points')
            .points(data.num);
    }


    convertCamera(data){
        this.xvizBuilder
            .primitive(`/camera/${data.type}`)
            .image(new Uint8Array(Buffer.from(data.data, 'base64')))
            // .dimensions(400, 120)
            .dimensions(640, 360)
            .id(data.type);
    }

}