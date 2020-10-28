/**
 * This is the demoApiServer.js file.
 * run this on the PSaaS Box to provide REST API for PSaaS
 */

//const conf = require('./demoApiServerConfig.json')
import express from 'express';
import { initialize } from 'express-openapi';
import v1WorldsService from './api-v1/services/worldsService.cjs';
import v1ApiDoc from './api-v1/api-doc';

const app = express();
initialize({
    app,
    // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
    // apiDoc: './api-v1/api-doc.yml',
    apiDoc: v1ApiDoc,
    dependencies: {
        worldsService: v1WorldsService
    },
    paths: './api-v1/paths'
});

app.listen(3000);