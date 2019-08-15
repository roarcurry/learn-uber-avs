import {XVIZMetadataBuilder, XVIZUIBuilder} from '@xviz/builder';
import {SIMWORLD, UPDATESIMWORLD, CAMERA, UPDATECAMERA6mm, UPDATECAMERA25mm} from "../constants";


// UI Builder
const xvizUiBuilder = new XVIZUIBuilder({});

// const panel_01 = xvizUiBuilder.panel({name: 'Camera_01'});
// const panel_02 = xvizUiBuilder.panel({name: 'Camera_02'});
// const videoBuilder_01 = xvizUiBuilder.video(['/camera/image_01']);
// const videoBuilder_02 = xvizUiBuilder.video(['/camera/image_02']);
// xvizUiBuilder.child(panel_01).child(videoBuilder_01);
// xvizUiBuilder.child(panel_02).child(videoBuilder_02);
const panel_01 = xvizUiBuilder.panel({name: 'Camera_01'});
const videoBuilder_01 = xvizUiBuilder.video({cameras: [`/camera/${UPDATECAMERA6mm}`, `/camera/${UPDATECAMERA25mm}`]});
xvizUiBuilder.child(panel_01).child(videoBuilder_01);



// XVIZ Builder
const xvizMetaBuider = new XVIZMetadataBuilder();

const date = new Date();
const startTime = date.getTime() / 1000;
const endTime = date.setDate(date.getDate() + 1) / 1000;

xvizMetaBuider
    .startTime(startTime)
    .endTime(endTime)
    // .startTime()
    // .endTime()


    .stream('/vehicle_pose')
    .category('pose')


    .stream('/vehicle/velocity')
    .category('TIME_SERIES')
    .type('float')
    .unit('m/s')
    .stream('/vehicle/acceleration')
    .category('TIME_SERIES')
    .type('float')
    .unit('m/s^2')
    .stream('/vehicle/wheel_angle')
    .category('TIME_SERIES')
    .type('float')
    .unit('degree')


    .stream('/tracklets/objects')
    .category('primitive')
    .type('polygon')
    .coordinate('VEHICLE_RELATIVE')
    .streamStyle({
        fill_color: '#fb0',
        height: 1.5,
        extruded: true
    })
    .stream('/tracklets/tracking_point')
    .category('primitive')
    .type('circle')
    .coordinate('VEHICLE_RELATIVE')
    .streamStyle({
        fill_color: '#fb0'
    })


    .stream('/lidar/points')
    .category('primitive')
    .type('point')
    .coordinate('VEHICLE_RELATIVE')
    .streamStyle({
        fill_color: '#999',
        radius_pixels: 1
    })


    .stream(`/camera/${UPDATECAMERA6mm}`)
    .category('primitive')
    .type('image')
    .stream(`/camera/${UPDATECAMERA25mm}`)
    .category('primitive')
    .type('image')


    .ui(xvizUiBuilder)
;

export const MetaData = xvizMetaBuider.getMetadata();