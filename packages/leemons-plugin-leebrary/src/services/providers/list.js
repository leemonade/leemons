const _ = require('lodash');

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

module.exports = { listProviders };
