const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const {
  getPluginNameWithVersionIfHaveFromServiceName,
  getPluginNameFromServiceName,
  getPluginVersionFromServiceName,
} = require('@leemons/service-name-parser');
const { newTransaction, addTransactionState } = require('@leemons/transactions');
const {
  mongoose: {
    mongo: { ObjectId },
  },
} = require('@leemons/mongodb');

async function addDeployment({ ctx, broker, domains: _domains, plugins, name, config }) {
  const domains = _.map(_domains, (domain) => new URL(domain).hostname);

  console.time('$node.services');
  const servicesRaw = await broker.call('$node.services', {
    withActions: true,
    withEvents: true,
  });
  console.timeEnd('$node.services');
  console.time('process');
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

  console.timeEnd('process');

  console.time('Deployment.findOne');
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

  console.timeEnd('Deployment.findOne');
  console.time('Deployment.create');

  let [deployment] = await ctx.db.Deployment.create(
    [
      {
        id: new ObjectId().toString(),
        name,
        domains,
        config,
      },
    ],
    { disableAutoDeploy: true, disableAutoLRN: true }
  );
  console.timeEnd('Deployment.create');
  deployment = deployment.toObject();

  console.time('newTransaction');
  ctx.meta.deploymentID = deployment.id;
  ctx.meta.transactionID = await newTransaction(ctx);
  console.timeEnd('newTransaction');

  console.time('addTransactionState');
  await addTransactionState(ctx, {
    action: 'leemonsMongoDBRollback',
    payload: {
      modelKey: 'Deployment',
      action: 'removeMany',
      data: [deployment.id],
    },
  });
  console.timeEnd('addTransactionState');

  console.time('deployment-manager.savePlugins');
  await ctx.tx.call(
    'deployment-manager.savePlugins',
    _.map(_.uniq(pluginNames), (pluginName) => ({
      pluginName,
      pluginVersion: getPluginVersionFromServiceName(pluginName) || 1,
    }))
  );
  console.timeEnd('deployment-manager.savePlugins');
  // We simulate that the store adds the permissions between the actions of the
  console.time('deployment-manager.savePluginsRelationships');
  await ctx.tx.call('deployment-manager.savePluginsRelationships', relationship);
  console.timeEnd('deployment-manager.savePluginsRelationships');
  // We simulate that the store tells us to start this deploymentID.
  console.time('deployment-manager.initDeployment');
  await ctx.tx.call('deployment-manager.initDeployment', relationship);
  console.timeEnd('deployment-manager.initDeployment');
  return { deployment };
}

module.exports = { addDeployment };
