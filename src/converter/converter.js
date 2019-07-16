import {XVIZBuilder, XVIZMetadataBuilder} from '@xviz/builder';
import {MemorySourceSink} from '@xviz/io';
import {XVIZData} from '@xviz/io';



export class Converter {
    constructor(vehicleNo) {
        this.vehicleNo = vehicleNo;
        this.source = new MemorySourceSink();

        this.buildMetaData(vehicleNo);

        this.testPos = [112.86684364764903, 28.10952545059363, 0];

        this.count = 1;
    }

    buildMetaData(vehicleNo){
        const xvizMetaBuider = new XVIZMetadataBuilder();
        const date = new Date();
        const startTime = date.getTime() / 1000;
        const endTime = date.setDate(date.getDate() + 1) / 1000;
        xvizMetaBuider
            .startTime(startTime)
            .endTime(endTime)

            .stream('/vehicle_pose')
            .category('pose')

            .stream('/object/shape')
            .category('primitive')
            .type('polygon')
            .coordinate('VEHICLE_RELATIVE')
            .streamStyle({
                fill_color: '#fb0',
                height: 1.5,
                extruded: true
            })
        ;

        this.source.writeSync('0-frame.json', {startTime: startTime, endTime: endTime, timing:[]});
        this.source.writeSync('1-frame.json', xvizMetaBuider.getMetadata());

        // const metadata = xvizMetaBuider.getMetadata();
        // console.log(JSON.stringify(metadata));
        // console.log(this.source.readSync('1-frame.json'));

        const xvizBuilder = new XVIZBuilder({
            metadata: this.source.readSync('1-frame.json') // See XVIZMetadataBuilder for generating metadata object
        });
        xvizBuilder
            .pose('/vehicle_pose')
            .timestamp(startTime)
            .mapOrigin(112.86684364764903, 28.10952545059363, 0)
            .position(0, 0, 0)
            .orientation(0, 0, 0);

        this.source.writeSync('2-frame.json', xvizBuilder.getMessage());
        this.source.readSync('0-frame.json').timing.push([startTime, startTime, 0, '2-frame.json']);

        xvizBuilder
            .primitive('/object/shape')
            .polygon([[10, 14, 0], [7, 10, 0], [13, 6, 0]])
            .id('object-1')

            .polygon([[-2, 20, 0], [5, 14, 0], [8, 17, 0], [1, 23, 0]])
            .style({
                fill_color: '#08f',
                height: 3.6
            })
            .id('object-2');

        this.source.writeSync('3-frame.json', xvizBuilder.getMessage());
        this.source.readSync('0-frame.json').timing.push([startTime, startTime, 1, '3-frame.json']);
    }

    convertPose(timestamp, position, orientation){
        const xvizBuilder = new XVIZBuilder({
            metadata: this.source.readSync('1-frame.json') // See XVIZMetadataBuilder for generating metadata object
        });
        xvizBuilder
            .pose('/vehicle_pose')
            .timestamp(timestamp)
            .mapOrigin(112.86684364764903, 28.10952545059363, 0)
            .position(0, 0, 0)
            .orientation(0, 0, 0);

        this.source.writeSync(this.count + 2 + '-frame.json', xvizBuilder.getMessage());
        this.source.readSync('0-frame.json').timing.push([timestamp, timestamp, this.count, this.count++ + 2 + '-frame.json']);
    }
}