const { MongoClient, ObjectId } = require('mongodb');
const http = require('http');
const https = require('https');

const { MONGO_URI, LEEMONS_API, DEPLOYMENT_TYPE, PLUGIN_NAME } = process.env;
const MANUAL_PASSWORD = process.env.MANUAL_PASSWORD || 'testing123';

const PLUGIN_VERSION = Number(process.env.PLUGIN_VERSION);

if (!MONGO_URI || !LEEMONS_API || !DEPLOYMENT_TYPE || !PLUGIN_NAME) {
  console.error('MONGO_URI, LEEMONS_API, DEPLOYMENT_TYPE and PLUGIN_NAME are required');
  process.exit(1);
}

if (Number.isNaN(PLUGIN_VERSION)) {
  throw new Error('PLUGIN_VERSION must be a number');
}

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function init() {
  try {
    await client.connect();
    database = client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// ····································································································
// GET DEPLOYMENTS

async function getDeploymentsByType(type) {
  const deployments = database.collection('package-manager_deployments');
  return deployments.find({ type }).toArray();
}

// ····································································································
// INSERT DEPLOYMENT-PLUGIN RELATIONSHIPS

function generateLRN({ partition, pluginName, region, deploymentID, modelName, resourceID }) {
  return `lrn:${partition}:${pluginName}:${region}:${deploymentID}:${modelName}:${resourceID}`;
}

async function generateUniqueId(deploymentID, deploymentPlugins) {
  const existingDoc = await deploymentPlugins.findOne({ deploymentID });
  if (!existingDoc) {
    throw new Error(`No existing document found for deploymentID: ${deploymentID}`);
  }

  const [partition, pluginName, region, modelName] = existingDoc.id.split(':').slice(1, 5);
  let id;
  let exists;
  do {
    id = generateLRN({
      partition,
      pluginName,
      region,
      deploymentID,
      modelName,
      resourceID: new ObjectId(),
    });
    // eslint-disable-next-line no-await-in-loop
    exists = await deploymentPlugins.findOne({ id });
  } while (exists);
  return id;
}

async function addPluginByDeploymentIds({ deploymentIds, pluginName, pluginVersion }) {
  const deploymentPlugins = database.collection('package-manager_deploymentplugins');

  const documents = await Promise.all(
    deploymentIds.map(async (deploymentID) => ({
      id: await generateUniqueId(deploymentID, deploymentPlugins),
      deploymentID,
      pluginName,
      pluginVersion,
    }))
  );

  const result = await deploymentPlugins.insertMany(documents);
  console.log('addPluginByDeploymentIds result:', result);
  return result;
}

// ····································································································
// RELOAD DEPLOYMENTS TO CREATE RELATIONSHIPS

const parsedUrl = new URL(LEEMONS_API);
const reqModule = parsedUrl.protocol === 'https:' ? https : http;

async function reloadDeploymentsRequest(deploymentIds) {
  const options = {
    method: 'POST',
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: '/api/deployment-manager/reload-all-deployments',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '[]',
    },
  };

  return new Promise((resolve, reject) => {
    const req = reqModule.request(options, (res) => {
      let responseBody = '';

      res.on('data', (d) => {
        responseBody += d;
      });

      res.on('end', () => {
        resolve({ body: JSON.parse(responseBody) });
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    const postData = JSON.stringify({
      manualPassword: MANUAL_PASSWORD,
      reloadRelations: true,
      ids: deploymentIds,
    });

    req.write(postData);

    req.end();
  });
}

// ····································································································
// MAIN

(async () => {
  try {
    await init();
    const deployments = await getDeploymentsByType(DEPLOYMENT_TYPE);
    const deploymentIds = deployments?.map((deployment) => deployment.id) ?? [];

    if (deploymentIds.length === 0) {
      console.log('No deployments found for the specified type.');
      await client.close();
      return;
    }

    await addPluginByDeploymentIds({
      deploymentIds,
      pluginName: PLUGIN_NAME,
      pluginVersion: PLUGIN_VERSION,
    });
    console.log(`Reloading ${deploymentIds.length} deployments... This could take some time. ⏱️`);
    const response = await reloadDeploymentsRequest(deploymentIds);
    console.log('response', response);

    await client.close();
  } catch (error) {
    console.error('Error inserting documents:');
    if (error.writeErrors) {
      error.writeErrors.forEach((writeError) => {
        console.error(writeError.err.errmsg);
      });
    } else {
      console.error('error', error);
    }
    await client.close();
  }
})();
