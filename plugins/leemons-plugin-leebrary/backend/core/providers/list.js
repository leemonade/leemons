const _ = require('lodash');
const { getPluginProviders } = require('leemons-providers');

/*
async function listProviders() {
  const providers = [];
  _.forIn(leemons.listProviders(), (value) => {
    if (value.services?.provider?.data) {
      providers.push({
        ...value.services?.provider?.data,
        providerName: value.name,
      });
    }
  });

  return providers;
}
*/

async function getProvider({ pluginKeyValue, ctx }) {
  const providers = await ctx.tx.call(`${pluginKeyValue.pluginName}.library.getProvider`);
  return {
    ...pluginKeyValue.params,
    providerName: pluginKeyValue.pluginName,
    providers,
  };
}

async function listProviders({ ctx }) {
  const providers = [];
  _.forIn(await getPluginProviders({ keyValueModel: ctx.tx.db.KeyValue, raw: true }), (value) => {
    providers.push(getProvider({ pluginKeyValue: value, ctx }));
  });
  return Promise.all(providers);
}

module.exports = { listProviders };
