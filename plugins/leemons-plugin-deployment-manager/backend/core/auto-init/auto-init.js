const _ = require('lodash');
const { getAutoDeploymentIDIfCanIFNotThrowError } = require('@leemons/deployment-manager');
const { getAllPluginsAndRelations } = require('./getAllPluginsAndRelations');

async function autoInit(broker) {
  // This function return a default deploymentID if not DISABLE_AUTO_INIT
  const deploymentID = getAutoDeploymentIDIfCanIFNotThrowError();
  const { pluginNames, relationship } = await getAllPluginsAndRelations(broker);

  // We simulate that the store adds the plugins that are installed for this deploymentID
  console.log('- Auto init - Pre SavePlugins');
  await broker.call(
    'deployment-manager.savePlugins',
    _.map(_.uniq(pluginNames), (pluginName) => ({
      pluginName,
      pluginVersion: 1,
    })),
    { meta: { deploymentID } }
  );
  console.log('- Auto init - Post SavePlugins');
  console.log('- Auto init - Pre SavePluginsRelationships');
  // We simulate that the store adds the permissions between the actions of the
  await broker.call('deployment-manager.savePluginsRelationships', relationship, {
    meta: { deploymentID },
  });
  console.log('- Auto init - Post SavePluginsRelationships');
  console.log('- Auto init - Pre InitDeployment');
  // We simulate that the store tells us to start this deploymentID.
  await broker.call('deployment-manager.initDeployment', relationship, {
    meta: { deploymentID },
  });
  console.log('- Auto init - Post InitDeployment');
}

module.exports = { autoInit };
