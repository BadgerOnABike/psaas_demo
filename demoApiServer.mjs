/**
 * This is the demoApiServer.js file.
 * run this on the PSaaS Box to provide REST API for PSaaS
 */

import conf from './demoApiServerConfig.json'
import express from 'express';
import cors from 'cors'
import { initialize } from 'express-openapi';
import v1WorldsService from './api-v1/services/worldsService.cjs';
import v1ConfigService from './api-v1/services/configService.cjs';
import v1ApiDoc from './api-v1/api-doc.js';

const app = express();
app.use(cors({ preflightContinue: true, credentials: true, origin: ['http://localhost:3009', 'http://localhost:3080'] }));

initialize({
    app: app,
    apiDoc: v1ApiDoc,
    dependencies: {
        worldsService: v1WorldsService,
        configService: v1ConfigService,
    },
    paths: './api-v1/paths'
});

// this line is a catch all for development, and will help isolate any stray error that has 
// not been trapped/catched.
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));


app.listen(conf.appPort, () => {
    console.clear();
    console.log("========================================================================")
    console.log(`${conf['app-long-name']} running on PORT ${conf.appPort} `)
    //console.log('conf', conf)

}
);