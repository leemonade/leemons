const { LeemonsError } = require('@leemons/error');
const {
  mongoose: {
    mongo: { ObjectId },
  },
} = require('@leemons/mongodb');
const {
  getPluginNameWithVersionIfHaveFromServiceName,
  getPluginNameFromServiceName,
  getPluginVersionFromServiceName,
} = require('@leemons/service-name-parser');
const { newTransaction, addTransactionState } = require('@leemons/transactions');
const _ = require('lodash');

/**
 * @typedef {import('moleculer').Context} MoleculerContext
 */

/**
 * Creates a new deployment in the Leemons application and sets up plugin relationships.
 *
 * @async
 * @function addDeployment
 * @param {Object} params - The params for creating a new deployment.
 * @param {MoleculerContext} params.ctx - The context object, typically provided by the Moleculer framework.
 * @param {Object} params.broker - The service broker object for interacting with other services.
 * @param {string[]} params.domains - An array of domain URLs for the deployment.
 * @param {string[]} params.plugins - An array of plugin names to be included in the deployment.
 * @param {string} params.type - The type of deployment.
 * @param {string} params.name - The name of the deployment.
 * @param {Object} params.config - Configuration object for the deployment.
 *
 * @throws {LeemonsError} Throws an error if a plugin is not found or if a domain is already in use.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the newly created deployment.
 *
 * @description
 * This function performs the following steps:
 * 1. Normalizes domain names by extracting hostnames.
 * 2. Fetches all services and their actions/events from the broker.
 * 3. Creates a map of plugin names to their actions and events.
 * 4. Validates the existence of all specified plugins.
 * 5. Establishes relationships between plugins, defining which actions and events each plugin can access.
 * 6. Checks for domain availability.
 * 7. Creates a new deployment record in the database.
 * 8. Sets up a transaction and rollback mechanism.
 * 9. Saves the plugins associated with the deployment.
 * 10. Saves the relationships between plugins.
 * 11. Initializes the deployment.
 *
 * This function is crucial for setting up new deployments in the Leemons system. It ensures that
 * all necessary plugins are properly installed and configured, and that the correct relationships
 * between plugins are established. This allows for a modular and extensible system where plugins
 * can interact with each other in a controlled and secure manner.
 *
 * @example
 * const result = await addDeployment({
 *   ctx,
 *   broker,
 *   domains: ['https://example.com', 'https://test.example.com'],
 *   plugins: ['users', 'courses', 'calendar'],
 *   type: 'production',
 *   name: 'Main Deployment',
 *   config: { theme: 'dark', language: 'en' }
 * });
 */
async function addDeployment({ ctx, broker, domains: _domains, plugins, type, name, config }) {
  const domains = _.map(_domains, (domain) => new URL(domain).hostname);

  const servicesRaw = await broker.call('$node.services', {
    withActions: true,
    withEvents: true,
  });
  const servicesByVersionAndName = {};
  _.forEach(servicesRaw, (serviceRaw) => {
    const serviceNameWithVersionIfHave = getPluginNameWithVersionIfHaveFromServiceName(
      serviceRaw.fullName
    );
    // eslint-disable-next-line no-prototype-builtins
    if (!servicesByVersionAndName.hasOwnProperty(serviceNameWithVersionIfHave)) {
      servicesByVersionAndName[serviceNameWithVersionIfHave] = {
        actions: [],
        events: [],
      };
    }
    servicesByVersionAndName[serviceNameWithVersionIfHave].actions.push(
      ...Object.keys(serviceRaw.actions)
    );
    servicesByVersionAndName[serviceNameWithVersionIfHave].events.push(
      ...Object.keys(serviceRaw.events)
    );
  });

  const pluginNames = [];
  const relationship = [];
  _.forEach(plugins, (fromPluginName) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!servicesByVersionAndName.hasOwnProperty(fromPluginName)) {
      throw new LeemonsError(ctx, {
        message: `Plugin name (${fromPluginName}) not found`,
      });
    }
    pluginNames.push(getPluginNameFromServiceName(fromPluginName));
    _.forEach(plugins, (toPluginName) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!servicesByVersionAndName.hasOwnProperty(toPluginName)) {
        throw new LeemonsError(ctx, {
          message: `Plugin name (${toPluginName}) not found`,
        });
      }
      relationship.push({
        fromPluginName: getPluginNameFromServiceName(fromPluginName),
        toPluginName: getPluginNameFromServiceName(toPluginName),
        actions: servicesByVersionAndName[toPluginName].actions,
        events: servicesByVersionAndName[toPluginName].events,
      });
    });
  });

  const domainAlreadyUsed = await ctx.db.Deployment.findOne(
    {
      domains: { $in: domains },
    },
    undefined,
    { disableAutoDeploy: true }
  )
    .select(['id'])
    .lean();
  if (domainAlreadyUsed)
    throw new LeemonsError(ctx, { message: 'One of this domains already in use' });

  let [deployment] = await ctx.db.Deployment.create(
    [
      {
        id: new ObjectId().toString(),
        name,
        domains,
        config,
        type,
      },
    ],
    { disableAutoDeploy: true, disableAutoLRN: true }
  );
  deployment = deployment.toObject();

  ctx.meta.deploymentID = deployment.id;
  ctx.meta.transactionID = await newTransaction(ctx);

  await addTransactionState(ctx, {
    action: 'leemonsMongoDBRollback',
    payload: {
      modelKey: 'Deployment',
      action: 'removeMany',
      data: [deployment.id],
    },
  });

  await ctx.tx.call('deployment-manager.initDeployment', { pluginNames, relationship });

  return { deployment };
}

module.exports = { addDeployment };
