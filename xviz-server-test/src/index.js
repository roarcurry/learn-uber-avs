
import {Log} from 'probe.gl';

import {XVIZServer} from './server/xviz-server'
import {XVIZProviderHandler} from './server/xviz-provider-handler'


const log = new Log({id: 'xvizserver-log'});

const logger = {
    log: (...msg) => log.log(...msg)(),
    error: (...msg) => log(0, ...msg)(),
    warn: (...msg) => log.log(1, ...msg)(),
    info: (...msg) => log.log(1, ...msg)(),
    verbose: (...msg) => log.log(2, ...msg)()
};

const options = {logger};

const handler = new XVIZProviderHandler(options);

const wss = new XVIZServer([handler], options, () => {
    logger.log(`Listening on port ${wss.server.address().port}`);
});
