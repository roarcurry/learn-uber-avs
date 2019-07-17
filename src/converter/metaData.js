import {XVIZMetadataBuilder} from '@xviz/builder';


const xvizMetaBuider = new XVIZMetadataBuilder();

const date = new Date();
const startTime = date.getTime() / 1000;
const endTime = date.setDate(date.getDate() + 1) / 1000;

xvizMetaBuider
    // .startTime(startTime)
    // .endTime(endTime)
    .startTime()
    .endTime()

    .stream('/vehicle_pose')
    .category('pose')

    .stream('/vehicle/velocity')
    .category('variable')
    .type('float')
    .unit('m/s')

    .stream('/vehicle/acceleration')
    .category('variable')
    .type('float')
    .unit('m/s^2')

    .stream('/vehicle/wheel_angle')
    .category('variable')
    .type('float')
    .unit('degree')



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

export const MetaData = xvizMetaBuider.getMetadata();