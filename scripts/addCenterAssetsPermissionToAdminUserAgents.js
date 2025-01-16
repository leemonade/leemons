/**
 * Script Name: Add Center Assets Permission to Admin User Agents
 * Description: This script assigns center-specific asset permissions to admin user agents.
 * Usage: Execute this script directly without any additional parameters. This script is thought to be run
 * once. It will add duplicated permissions to users agents otherwise.
 * Results:
 * - Adds documents to the "v1::users_useragentpermissions" collection. One per user agent. The permission
 * name is in the format of "users.center.assets.{centerId}".
 *
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

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

function generateLRN({ partition, pluginName, region, deploymentID, modelName, resourceID }) {
  return `lrn:${partition}:${pluginName}:${region}:${deploymentID}:${modelName}:${resourceID}`;
}

async function getDeploymentProperties(deploymentID) {
  const deployment = await database
    .collection('package-manager_deploymentplugins')
    .findOne({ deploymentID });

  if (!deployment) {
    throw new Error(`No existing deployment plugins found for deploymentID: ${deploymentID}`);
  }

  const [, partition, , region] = deployment.id.split(':');
  return { partition, region };
}

async function getUserAgentsBySysName({ sysName }) {
  const profile = await database.collection('v1::users_profiles').findOne({ sysName });

  const profileRole = await database
    .collection('v1::users_profileroles')
    .findOne({ profile: profile.id });

  return database.collection('v1::users_useragents').find({ role: profileRole.role }).toArray();
}

async function addPermissionToUserAgents({ userAgents }) {
  const userAgentPermissionsCollection = database.collection('v1::users_useragentpermissions');
  await Promise.all(
    userAgents.map(async (userAgent) => {
      const { partition, region } = await getDeploymentProperties(userAgent.deploymentID);
      const center = await database
        .collection('v1::users_rolecenters')
        .findOne({ role: userAgent.role });
      const permissionName = `users.center.assets.${center.center}`;
      const id = generateLRN({
        partition,
        pluginName: 'users',
        region,
        deploymentID: userAgent.deploymentID,
        modelName: 'UserAgentPermission',
        resourceID: new ObjectId(),
      });

      console.log('--------------------------------');
      console.log('Adding permission to user agent: ', userAgent.id);
      console.log('Center: ', center.center);

      return userAgentPermissionsCollection.insertOne({
        id,
        permissionName,
        userAgent: userAgent.id,
        actionName: 'admin',
        deploymentID: userAgent.deploymentID,
        isDeleted: false,
        deletedAt: null,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    })
  );
}

// ····································································································
// MAIN FUNCTION

(async () => {
  try {
    await init();
    const adminUserAgents = await getUserAgentsBySysName({ sysName: 'admin' });
    console.log('Admin user agents found: ', adminUserAgents.length);

    await addPermissionToUserAgents({ userAgents: adminUserAgents });

    await client.close();
  } catch (error) {
    console.error('ERROR', error);
    await client.close();
  }
})();
