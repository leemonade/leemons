const { getByType: getProvidersByType } = require('../../providers/getByType');

async function byAddons({ pluginNames, ctx, query }) {
  if (!pluginNames?.length) {
    return [];
  }

  const providers = await getProvidersByType({ type: 'addon', ctx });
  const results = await Promise.allSettled(
    providers
      .filter(
        (provider) => pluginNames.includes(provider.pluginName) && provider.supportedMethods?.list
      )
      .map((provider) => ctx.call(`${provider.pluginName}.assets.list`, query))
  );

  // Join the results, making unique the assetsIds
  return Array.from(
    new Set(results.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])))
  );
}

module.exports = { byAddons };
