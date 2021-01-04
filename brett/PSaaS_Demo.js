"use strict";
/**
 * An example that creates and runs a job through PSaaS Builder.
 */
Object.defineProperty(exports, "__esModule", {
  value: true,
});
/** ignore this comment */
const fs = require("fs");
const path = require("path");
const modeller = require("psaas-js-api");
const luxon_1 = require("luxon");
const semver = require("semver");
const { FuelPatch } = require("psaas-js-api/src/psaasInterface");
let serverConfig = new modeller.defaults.ServerConfiguration();

luxon_1.Settings.defaultZoneName = 'UTC-6'

//initialize the connection settings for PSaaS_Builder
modeller.globals.SocketHelper.initialize(
  serverConfig.builderAddress,
  serverConfig.builderPort
);
//turn on debug messages
modeller.globals.PSaaSLogger.getInstance().setLogLevel(
  modeller.globals.PSaaSLogLevel.DEBUG
);
//set the default MQTT broker to use when listening for PSaaS events
modeller.client.JobManager.setDefaults({
  host: serverConfig.mqttAddress,
  port: serverConfig.mqttPort,
  topic: serverConfig.mqttTopic,
  username: serverConfig.mqttUser,
  password: serverConfig.mqttPassword,
});
//the directory of the test files
//make sure the path ends in a trailing slash
let localDir = path.join(__dirname, "../");
//let psaasVersion = /*vers*/ "6.2.5.6"; /*/vers*/
//make sure the local directory has been configured
if (localDir.includes("@JOBS@")) {
  console.log(
    "The job directory has not been configured. Please edit the job directory before running the example //server."
  );
  process.exit();
}
/**
 * Async
 * @param t The timeout in milliseconds
 * @param callback The function that will be called when the delay is up.
 */
function delay(t) {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve();
      }, t);
  });
}
/**
* Recursively handle nodes of the validation tree and
* print relevant ones to the console.
* @param node The node of the validation tree to handle.
*/
function handleErrorNode(node) {
  //leaf node
  if (node.children.length == 0) {
      console.error(`'${node.getValue()}' is invalid for '${node.propertyName}': "${node.message}"`);
  }
  //branch node
  else {
      node.children.forEach(child => {
          handleErrorNode(child);
      });
  }
}
//an asynchronous function for creating a job and listening for status messages.
(async function () {
  //fetch the default settings for some parameters from PSaaS Builder
  let jDefaults = await new modeller.defaults.JobDefaults().getDefaultsPromise();
  modeller.globals.PSaaSLogger.getInstance().info("Building Prometheus job.");
  //set this to the location of the test files folder.
  let prom = new modeller.psaas.PSaaS();
  //add the projection and elevation files as attachments
  let projContents = fs.readFileSync(
    localDir + "Dogrib_dataset/elevation.prj",
    "utf8"
  );
  let elevContents = fs.readFileSync(
    localDir + "Dogrib_dataset/elevation.asc",
    "utf8"
  );
  let projAttachment = prom.addAttachment("elevation.prj", projContents);
  let elevAttachment = prom.addAttachment("elevation.asc", elevContents);
  if (!projAttachment || !elevAttachment) {
    throw Error("Cannot add attachment");
  }
  prom.setProjectionFile("" + projAttachment);
  prom.setElevationFile("" + elevAttachment);
  //add the rest of the files as paths to locations on disk
  prom.setFuelmapFile(localDir + "Dogrib_dataset/fbp_fuel_type.asc");
  prom.setLutFile(localDir + "Dogrib_dataset/fbp_lookup_table.csv");
  prom.setTimezoneByValue(18); //hard coded to MDT, see example_timezone.js for an example getting the IDs
  let degree_curing = prom.addGridFile(
    localDir + "Dogrib_dataset/degree_of_curing.asc",
    localDir + "Dogrib_dataset/degree_of_curing.prj",
    modeller.psaas.GridFileType.DEGREE_CURING
  );
  let fuel_patch = prom.addLandscapeFuelPatch(
    "O-1a Matted Grass",
    "C-7 Ponderosa Pine"
  );
  let gravel_road = prom.addFileFuelBreak(
    localDir + "Dogrib_dataset/access_gravel_road.kmz"
  );
  gravel_road.setName("Gravel Road");
  let unimproved_road = prom.addFileFuelBreak(
    localDir + "Dogrib_dataset/access_unimproved_road.kmz"
  );
  unimproved_road.setName("Unimproved Road");
  let river = prom.addFileFuelBreak(
    localDir + "Dogrib_dataset/hydrology_river.kmz"
  );
  river.setName("Rivers");
  let stream = prom.addFileFuelBreak(
    localDir + "Dogrib_dataset/hydrology_stream.kmz"
  );
  stream.setName("Streams");
  let ws = prom.addWeatherStation(
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
    luxon_1.DateTime.fromISO("2001-09-25"),
    luxon_1.DateTime.fromISO("2001-10-30")
  );

  //let b3Yaha2 = ws.addWeatherStream(
  //  localDir + "Dogrib_dataset/weather_B3_hourly_20010925to1030.csv",
  //  94.0,
  //  17,
  //  modeller.psaas.HFFMCMethod.LAWSON,
  //  89.0,
  //  58.0,
  //  482.0,
  //  0.0,
  //  "2001-09-25",
  //  "2001-10-30"
  //);
  let wpatch = prom.addLandscapeWeatherPatch( 
    luxon_1.DateTime.fromISO("2001-10-16T13:00:00"),
    modeller.globals.Duration.createTime(13,0,0,false),
    luxon_1.DateTime.fromISO("2001-10-16T21:00:00"),
    modeller.globals.Duration.createTime(21,0,0,false)
  );
  wpatch.setWindDirOperation(modeller.psaas.WeatherPatchOperation.PLUS, 17.6);
  wpatch.setRhOperation(modeller.psaas.WeatherPatchOperation.PLUS, 5);
  wpatch.setName('Landscape_Wx_patch');
  
  let wpatch2 = prom.addFileWeatherPatch(
    localDir + "Dogrib_dataset/weather_patch_wd270.kml",
    luxon_1.DateTime.fromISO("2001-10-16T13:00:00"),
    modeller.globals.Duration.createTime(13,0,0,false),
    luxon_1.DateTime.fromISO("2001-10-16T21:00:00"),
    modeller.globals.Duration.createTime(21,0,0,false)
  );
  wpatch2.setWindDirOperation(modeller.psaas.WeatherPatchOperation.EQUAL, 270);
  wpatch2.setName('Polygon_Wx_patch');
  //create the ignition points
  let ll1 = new modeller.globals.LatLon(51.65287648142513, -115.4779078053444);
  let ig3 = prom.addPointIgnition(ll1, luxon_1.DateTime.fromISO("2001-10-16T13:00:00") );
  let ll2 = new modeller.globals.LatLon(51.66090499909746, -115.4086430000001);
  let ig4 = prom.addPointIgnition(ll2, luxon_1.DateTime.fromISO("2001-10-16T16:00:00"));
  //let polyign = prom.addFileIgnition(
  //  "2001-10-16T13:00:00",
  //  localDir + "Dogrib_dataset/poly_ign.kmz",
  //  "This should be a polygon."
  //);
  //let lineign = prom.addFileIgnition(
  //  "2001-10-16T13:00:00",
  //  localDir + "Dogrib_dataset/line_fire.shp",
  //  "This should be a line."
  //);
  //emit some statistics at the end of timesteps
  prom.timestepSettings.addStatistic(
    modeller.globals.GlobalStatistics.TOTAL_BURN_AREA
  );
  prom.timestepSettings.addStatistic(
    modeller.globals.GlobalStatistics.DATE_TIME
  );
  prom.timestepSettings.addStatistic(
    modeller.globals.GlobalStatistics.SCENARIO_NAME
  );
  //create a scenario
  let scen1 = prom.addScenario(luxon_1.DateTime.fromISO("2001-10-16T13:00:00"), luxon_1.DateTime.fromISO("2001-10-16T22:00:00"));
  scen1.setName("Best Dogrib Fit");
  scen1.addBurningCondition(luxon_1.DateTime.fromISO("2001-10-16"), 0, 24, 19, 0.0, 95.0, 0.0);
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
  scen1.setFbpOptions(true, true);
  scen1.setFmcOptions(-1, 0.0, true, false);
  scen1.setFwiOptions(false, true, false, false, false);
  scen1.addIgnitionReference(ig3);
  scen1.addIgnitionReference(ig4);
  //scen1.addIgnitionReference(polyign);
  scen1.addWeatherStreamReference(b3Yaha);
  //scen1.addWeatherStreamReference(b3Yaha2);
  scen1.addWeatherPatchReference(wpatch2, 2);
  scen1.addFuelPatchReference(fuel_patch, 0);
  scen1.addGridFileReference(degree_curing, 1);
  scen1.addWeatherPatchReference(wpatch, 3);
  let ovf1 = prom.addOutputVectorFileToScenario(
    modeller.psaas.VectorFileType.KML,
    "best_fit/perim.kml",
    luxon_1.DateTime.fromISO("2001-10-16T13:00:00"),
    luxon_1.DateTime.fromISO("2001-10-16T22:00:00"),
    scen1
  );
  ovf1.mergeContact = true;
  ovf1.multPerim = true;
  ovf1.removeIslands = true;
  ovf1.metadata = jDefaults.metadataDefaults;
  let ogf1 = prom.addOutputGridFileToScenario(
    modeller.globals.GlobalStatistics.TEMPERATURE,
    "best_fit/temp.txt",
    luxon_1.DateTime.fromISO("2001-10-16T22:00:00"),
    modeller.psaas.Output_GridFileInterpolation.IDW,
    scen1
  );
  ogf1.shouldStream = true;
  let ogf2 = prom.addOutputGridFileToScenario(
    modeller.globals.GlobalStatistics.BURN_GRID,
    "best_fit/burn_grid.tif",
    luxon_1.DateTime.fromISO("2001-10-16T22:00:00"),
    modeller.psaas.Output_GridFileInterpolation.IDW,
    scen1
  );
  //allow the file to be streamed to a remote location after it is written (ex. streamOutputToMqtt, streamOutputToGeoServer).
  ogf2.shouldStream = true;
  let osf1 = prom.addOutputSummaryFileToScenario(scen1, "best_fit/summary.txt");
  osf1.outputs.outputApplication = true;
  osf1.outputs.outputFBP = true;
  osf1.outputs.outputFBPPatches = true;
  osf1.outputs.outputGeoData = true;
  osf1.outputs.outputIgnitions = true;
  osf1.outputs.outputInputs = true;
  osf1.outputs.outputLandscape = true;
  osf1.outputs.outputScenario = true;
  osf1.outputs.outputScenarioComments = true;
  osf1.outputs.outputWxPatches = true;
  osf1.outputs.outputWxStreams = true;
  //stream output files to the MQTT connection
  //prom.streamOutputToMqtt();
  //stream output files to a GeoServer instance
  //prom.streamOutputToGeoServer();
  let errors = prom.checkValid();
  if (errors.length > 0) {
      //write the errors to the console
      errors.forEach(node => {
          handleErrorNode(node);
      });
  }
  else {
      let wrapper = null;
      //not yet supported by a released version of PSaaS
      if (semver.gte(modeller.psaas.VersionInfo.localVersion(modeller.psaas.VersionInfo.version_info), '2.6.1')) {
          //validate the job asynchronously
          wrapper = await prom.validateJobPromise();
      }
      else {
          //start the job asynchronously
          wrapper = await prom.beginJobPromise();
      }
      //trim the name of the newly started job
      let jobName = wrapper.name.replace(/^\s+|\s+$/g, '');
      //a manager for listening for status messages
      let manager = new modeller.client.JobManager(jobName);
      //start the job manager
      await manager.start();
      //if possible the job will first be validated, catch the validation response
      manager.on('validationReceived', (args) => {
          //the FGM could not be validated. It's possible that the PSaaS version used doesn't support validation
          if (!args.validation.success) {
              //this probably means that the PSaaS Manager and PSaaS versions are different, the job may be able to be started without validation
              //at this point in time but we'll just exit and consider this an unexpected setup
              args.manager.dispose(); //close the connection that is listening for status updates
              console.log("Validation could not be run, check your PSaaS version");
          }
          //errors were found in the FGM
          else if (!args.validation.valid) {
              args.manager.dispose(); //close the connection that is listening for status updates
              console.log("The submitted FGM is not valid");
              //just dump the error list, let the user sort through it
              console.log(args.validation.error_list);
          }
          //the FGM is valid, start it running
          else {
              console.log("FGM valid, starting job");
              //add a delay, shouldn't be needed but it's here so the user can see the process happening
              delay(100)
                  .then(() => {
                  //use rerun to start the job. Rerun can be used on any job that is in
                  //the finished job list in PSaaS Manager.
                  args.manager.broadcastJobRerun(jobName);
              });
          }
      });
      //when the PSaaS job triggers that it is complete, shut down the listener
      manager.on('simulationComplete', (args) => {
          args.manager.dispose(); //close the connection that is listening for status updates
          if (args.hasOwnProperty("time") && args.time != null) {
              console.log(`Simulation complete at ${args.time.toISOString()}.`);
          }
          else {
              console.log("Simulation complete.");
          }
      });
      //catch scenario failure
      manager.on('scenarioComplete', (args) => {
          if (!args.success) {
              if (args.hasOwnProperty("time") && args.time != null) {
                  console.log(`At ${args.time.toISOString()} a scenario failed: ${args.errorMessage}`);
              }
              else {
                  console.log(`A scenario failed: ${args.errorMessage}`);
              }
          }
      });
      //listen for statistics at the end of timesteps
      manager.on('statisticsReceived', (args) => {
          if (args.hasOwnProperty("time") && args.time != null) {
              console.log(`Received statistics at ${args.time.toISOString()}`);
              for (const stat of args.statistics) {
                  console.log("    Statistic " + stat.key + " with value " + stat.value);
              }
          }
          else {
              for (const stat of args.statistics) {
                  console.log("Received statistic " + stat.key + " with value " + stat.value);
              }
          }
      });
  }
})().then(x => console.log("Job created, waiting for results."));
//# sourceMappingURL=example_job.js.map