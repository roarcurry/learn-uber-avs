import {XVIZBuilder, XVIZMetadataBuilder} from '@xviz/builder';
import {MemorySourceSink} from '@xviz/io';
import {XVIZData} from '@xviz/io';

const coordtransform = require('coordtransform');

import {MetaData} from "./metaData";

export class Converter {
    constructor(vehicleNo) {
        this.vehicleNo = vehicleNo;

        this.testPos = [112.86684364764903, 28.10952545059363, 0];

        this.count = 0;
    }


    convertPose(timestamp, position, orientation){
        timestamp /= 1000;

        const xvizBuilder = new XVIZBuilder({
            metadata: MetaData // See XVIZMetadataBuilder for generating metadata object
        });
        xvizBuilder
            .pose('/vehicle_pose')
            .timestamp(timestamp)
            // .mapOrigin(112.86684364764903, 28.10952545059363, 0)
            .mapOrigin(...coordtransform.gcj02towgs84(...coordtransform.bd09togcj02(position.lon, position.lat)), position.alt)
            .position(0, 0, 0)
            .orientation(orientation.roll, orientation.pitch, (450 - orientation.yaw) % 360 * Math.PI / 180);

        return xvizBuilder.getMessage();
    }

}