"use strict";
/**
 * An demo that creates and runs a job through PSaaS Builder.
 */
Object.defineProperty(exports, "__esModule", {
    value: true,
});

//** load model dependencies */
const fs = require("fs");
const path = require("path");

// load config from environment
require('dotenv').config()

// use ENV stuff to avoid exposing credentials in repos. 
const geoserverUser = process.env.GEOSERVER_USER
const geoserverPass = process.env.GEOSERVER_PASS

// this line actually loads the PSaaS Javascript API.
const modeller = require("psaas-js-api");

// collect settings from defaults and server config.
let serverConfig = new modeller.defaults.ServerConfiguration();

// Initialize the connection settings for PSaaS_Builder
// Commented lines [inline] are how to manually override the server settings.
modeller.globals.SocketHelper.initialize(
    serverConfig.builderAddress,
    //'192.168.80.129',
    serverConfig.builderPort
    //32479
);

// turn on debug messages using psaas logger
modeller.globals.PSaaSLogger.getInstance().setLogLevel(
    modeller.globals.PSaaSLogLevel.DEBUG
);

// Configure the MQTT broker PSaaS Client (this script) will use to listen for PSaaS events.
// Commented lines [inline] are how to manually override the server settings.
modeller.client.JobManager.setDefaults({
    host: serverConfig.mqttAddress,
    //host: "emqx.vm.sparcsonline.com",
    port: serverConfig.mqttPort,
    //port: 1883,
    topic: serverConfig.mqttTopic,
    //topic: "psaas",
    username: serverConfig.mqttUsername,
    //username: "psaasuser",
    password: serverConfig.mqttPassword,
    //password: "psaaspass"
});

//the directory containing  test files & data sets.
//make sure the path ends in a trailing slash
let localDir = path.join(__dirname, '../');

//** an asynchronous function for creating a job and listening for status messages. **/
(async function () {

    // Fetch the default settings for some parameters from PSaaS Builder
    let jDefaults = await new modeller.defaults.JobDefaults().getDefaultsPromise();

    // make a console log entry... the long way
    modeller.globals.PSaaSLogger.getInstance().info("Building Prometheus job.");

    // Now create an empty psaas model.
    let psaasModel = new modeller.psaas.PSaaS();

    //add the projection and elevation files as attachments
    //note the dataset folder is a prefix here:
    // this is a round about way of creating a proj and elevation file from a string.

    // read the data to be used for the proj file and elevation file into memory as a string.
    let projContents = fs.readFileSync(localDir + "Dogrib_dataset/elevation.prj", "utf8");
    let elevContents = fs.readFileSync(localDir + "Dogrib_dataset/elevation.asc", "utf8");

    // now provide the string data to the model, and the model will write the files in temp
    let projAttachment = psaasModel.addAttachment("elevation.prj", projContents);

    // the variables can be then used as file handles to refer to the files.
    let elevAttachment = psaasModel.addAttachment("elevation.asc", elevContents);

    //if the attach comes back with a false/fail, bail and report the error
    if (!projAttachment || !elevAttachment) {
        throw Error("Cannot add attachment");
    }
    // set the projection file while forcing string coercion
    psaasModel.setProjectionFile("" + projAttachment);

    // a better way to do this that makes more sense to scripters is 
    psaasModel.setElevationFile(String(elevAttachment));

    //add the rest of the files as paths to locations on disk
    psaasModel.setFuelmapFile(localDir + "Dogrib_dataset/fbp_fuel_type.asc");
    psaasModel.setLutFile(localDir + "Dogrib_dataset/fbp_lookup_table.csv");

    // Set the timezone of the model 
    // here we are setting to MDT, see example_timezone.js for more timezone IDs eg 25 = CDT.
    psaasModel.setTimezoneByValue(18);

    // create a degree of curing object in the model. it will get used later
    // when it is attached to the scenario as a reference. 
    let degree_curing = psaasModel.addGridFile(
        modeller.psaas.GridFileType.DEGREE_CURING,
        localDir + "Dogrib_dataset/degree_of_curing.asc",
        localDir + "Dogrib_dataset/degree_of_curing.prj"
    );

    // create a landscape patch - Must still be attached to the scenario later by reference.
    let fuel_patch = psaasModel.addLandscapeFuelPatch(
        "O-1a Matted Grass",
        "O-1b Standing Grass"
    );


    //** Adding fuel breaks to the model */

    //create a fuel break object and load it with geometry from KMZ
    let gravel_road = psaasModel.addFileFuelBreak(
        localDir + "Dogrib_dataset/access_gravel_road.kmz"
    );

    // override the default name of this object.
    gravel_road.setName("Gravel Road");

    //another fuel break....
    let unimproved_road = psaasModel.addFileFuelBreak(
        localDir + "Dogrib_dataset/access_unimproved_road.kmz"
    );
    unimproved_road.setName("Unimproved Road");

    let river = psaasModel.addFileFuelBreak(localDir + "Dogrib_dataset/hydrology_river.kmz");
    river.setName("Rivers");

    let stream = psaasModel.addFileFuelBreak(localDir + "Dogrib_dataset/hydrology_stream.kmz");
    stream.setName("Streams");



    //** Weather stations */


    // Add a weather station to the model, with elevation and lat lon.
    let ws = psaasModel.addWeatherStation(
        1483.0,
        new modeller.globals.LatLon(51.6547, -115.3617)
    );
    let b3Yaha = ws.addWeatherStream(
        localDir + "Dogrib_dataset/weather_B3_hourly_20010925to1030.csv",
        94.0,
        17,
        modeller.psaas.HFFMCMethod.LAWSON,
        89.0,
        58.0,
        482.0,
        0.0,
        "2001-09-25",
        "2001-10-30"
    );
    let wpatch = psaasModel.addLandscapeWeatherPatch(
        "2001-10-16T13:00:00",
        "13:00:00",
        "2001-10-16T21:00:00",
        "21:00:00"
    );
    wpatch.setWindDirOperation(modeller.psaas.WeatherPatchOperation.PLUS, 10);
    wpatch.setRhOperation(modeller.psaas.WeatherPatchOperation.PLUS, 5);
    let wpatch2 = psaasModel.addFileWeatherPatch(
        localDir + "Dogrib_dataset/weather_patch_wd270.kmz",
        "2001-10-16T13:00:00",
        "13:00:00",
        "2001-10-16T21:00:00",
        "21:00:00"
    );
    wpatch2.setWindDirOperation(modeller.psaas.WeatherPatchOperation.EQUAL, 270);
    //create the ignition points
    let ll1 = await new modeller.globals.LatLon(
        51.65287648142513,
        -115.4779078053444
    );
    let ig3 = psaasModel.addPointIgnition("2001-10-16T13:00:00", ll1);
    let ll2 = await new modeller.globals.LatLon(
        51.66090499909746,
        -115.4086430000001
    );
    let ig4 = psaasModel.addPointIgnition("2001-10-16T16:00:00", ll2);

    psaasModel.timestepSettings.addStatistic(
        modeller.globals.GlobalStatistics.TOTAL_BURN_AREA
    );
    psaasModel.timestepSettings.addStatistic(
        modeller.globals.GlobalStatistics.DATE_TIME
    );
    psaasModel.timestepSettings.addStatistic(
        modeller.globals.GlobalStatistics.SCENARIO_NAME
    );


    //** Add and configure scenarios in the model */
    //create a scenario
    let scen1 = await psaasModel.addScenario(
        "2001-10-16T13:00:00",
        "2001-10-16T22:00:00"
    );
    // name the scenario
    scen1.setName("Best Dogrib Fit");

    // add a burning condition to the scenario.
    scen1.addBurningCondition("2001-10-16", 0, 24, 19, 0.0, 95.0, 0.0);

    // set the FGM options for the scenario.
    scen1.setFgmOptions(
        modeller.globals.Duration.createTime(0, 2, 0, false),
        1.0,
        1.0,
        1.0,
        false,
        true,
        true,
        true,
        false,
        true,
        50.0
    );
    //optionally set dx, dy, and dt
    scen1.setProbabilisticValues(
        1.0,
        1.0,
        modeller.globals.Duration.createTime(0, 0, 10, false)
    );

    // set FPB, FMC and FWI Options.
    scen1.setFbpOptions(true, true);
    scen1.setFmcOptions(-1, 0.0, true, false);
    scen1.setFwiOptions(false, true, false, false, false);

    // now we add the ignitions to the scenario.
    scen1.addIgnitionReference(ig3);
    scen1.addIgnitionReference(ig4);

    // add the weather stream reference to the scenario.
    // note we never add a weather station to the scenario,
    // just the stream.
    scen1.addWeatherStreamReference(b3Yaha);

    // add the fuel patch to scenario. Normally the index values would matter.
    // current bugs make the index order not be honored, but we should set them
    // correctly regardless of the bug.

    scen1.addFuelPatchReference(fuel_patch, 0);

    // add curing to the scenario.
    scen1.addGridFileReference(degree_curing, 1);

    // add the weather patches to the Scenario.
    scen1.addWeatherPatchReference(wpatch, 3);
    scen1.addWeatherPatchReference(wpatch2, 2);

    //** Creating and Adding Outputs  */

    // Create and add a Vector KML output 
    let vectorKML = psaasModel.addOutputVectorFileToScenario(
        modeller.psaas.VectorFileType.KML,
        "best_fit/perim.kml",
        "2001-10-16T13:00:00",
        "2001-10-16T22:00:00",
        scen1
    );

    // set options for the KML outputs.
    vectorKML.mergeContact = true;
    vectorKML.multPerim = true;
    vectorKML.removeIslands = true;
    // vectorKML.shouldStream = true;
    vectorKML.metadata = jDefaults.metadataDefaults;

    // Create and add a raster temperature output 
    let rasterTemperature = psaasModel.addOutputGridFileToScenario(
        modeller.globals.GlobalStatistics.TEMPERATURE,
        "best_fit/temp.txt",
        "2001-10-16T21:00:00",
        modeller.psaas.Output_GridFileInterpolation.IDW,
        scen1
    );

    // Create and add a raster burngrid output 
    let rasterBurn = psaasModel.addOutputGridFileToScenario(
        modeller.globals.GlobalStatistics.BURN_GRID,
        "best_fit/burn_grid.tif",
        "2001-10-16T22:00:00",
        modeller.psaas.Output_GridFileInterpolation.IDW,
        scen1
    );

    //allow the file to be streamed to a remote location after it is written 
    // (ex. streamOutputToMqtt, streamOutputToGeoServer).
    // rasterBurn.shouldStream = true;

    // Create and add a summary textfile output 
    let modelSummary = psaasModel.addOutputSummaryFileToScenario(scen1, "best_fit/summary.txt");
    modelSummary.outputs.outputApplication = true;
    modelSummary.outputs.outputFBP = true;
    modelSummary.outputs.outputFBPPatches = true;
    modelSummary.outputs.outputGeoData = true;
    modelSummary.outputs.outputIgnitions = true;
    modelSummary.outputs.outputInputs = true;
    modelSummary.outputs.outputLandscape = true;
    modelSummary.outputs.outputScenario = true;
    modelSummary.outputs.outputScenarioComments = true;
    modelSummary.outputs.outputWxPatches = true;
    modelSummary.outputs.outputWxStreams = true;

    //stream output files to the MQTT connection
    //psaasModel.streamOutputToMqtt();
    //stream output files to a GeoServer instance
    //  psaasModel.streamOutputToGeoServer(geoserverUser, geoserverPass, "geowh.vm.sparcsonline.com/geoserver", "psaastests", "psaastest_store", "EPSG:4326");

    //test to see if all required parameters have been set
    // this logic is conditional if the model is valid.
    if (psaasModel.isValid()) {
        console.log("Model is valid...");
        console.log(psaasModel.inputs.ignitions);
        //start the job asynchronously
        let wrapper = await psaasModel.beginJobPromise();
        //trim the name of the newly started job
        let jobName = wrapper.name.replace(/^\s+|\s+$/g, "");
        //a manager for listening for status messages
        let manager = new modeller.client.JobManager(jobName);
        //start the job manager
        await manager.start();
        //when the PSaaS job triggers that it is complete, shut down the listener
        manager.on("simulationComplete", (args) => {
            args.manager.dispose(); //close the connection that is listening for status updates
            console.log("Simulation complete.");
        });
        //catch scenario failure
        manager.on("scenarioComplete", (args) => {
            if (!args.success) {
                console.log(`A scenario failed: ${args.errorMessage}`);
            }
        });
        //listen for statistics at the end of timesteps
        manager.on("statisticsReceived", (args) => {
            for (const stat of args.statistics) {
                console.log(
                    "Received statistic " + stat.key + " with value " + stat.value
                );
            }
        });
    } else {
        console.log("Model is NOT valid...");
        console.log("Inputs valid?...", psaasModel.inputs.isValid());
        console.log(psaasModel.inputs);
        psaasModel.inputs.isValid();
    }
})().then((x) => console.log("Job created, waiting for results."));
//# sourceMappingURL=example_job.js.map