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

  await ctx.tx.call(
    'deployment-manager.savePlugins',
    _.map(_.uniq(pluginNames), (pluginName) => ({
      pluginName,
      pluginVersion: getPluginVersionFromServiceName(pluginName) || 1,
    }))
  );
  // We simulate that the store adds the permissions between the actions of the
  await ctx.tx.call('deployment-manager.savePluginsRelationships', relationship);
  // We simulate that the store tells us to start this deploymentID.
  await ctx.tx.call('deployment-manager.initDeployment', relationship);
  return { deployment };
}

module.exports = { addDeployment };
