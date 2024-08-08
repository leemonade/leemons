const { getAutoDeploymentIDIfCanIFNotThrowError } = require('@leemons/deployment-manager');

const { getAllPluginsAndRelations } = require('./getAllPluginsAndRelations');

/**
 * @param {import('moleculer').ServiceBroker} broker
 */
async function autoInit(broker) {
  // This function return a default deploymentID if not DISABLE_AUTO_INIT
  const deploymentID = getAutoDeploymentIDIfCanIFNotThrowError();
  const pluginsAndRelations = await getAllPluginsAndRelations(broker);

  console.log('- Auto init - Pre InitDeployment');

  // We emulate that the external "service-catalog" tells us to start this deploymentID.
  await broker.call('deployment-manager.initDeployment', pluginsAndRelations, {
    meta: { deploymentID },
  });

  console.log('- Auto init - Post InitDeployment');
}

module.exports = { autoInit };
