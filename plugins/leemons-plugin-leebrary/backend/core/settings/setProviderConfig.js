const { tables } = require('../tables');
const { setActiveProvider } = require('./setActiveProvider');

async function setProviderConfig(providerName, config, { transacting: _transacting } = {}) {
  if (
    !['plugins.bulk-template', 'plugins.admin', 'plugins.leebrary'].includes(
      this.calledFrom
    )
  ) {
    throw new Error('Must be called from leemons-plugin-leebrary');
  }

  return global.utils.withTransaction(
    async (transacting) => {
      const provider = leemons.getProvider(providerName);
      if (provider && provider.services) {
        if (!provider.services.provider)
          throw new global.utils.HttpError(
            412,
            'Bad implementation for media library, need the service: provider'
          );
        if (!provider.services.provider.setConfig)
          throw new global.utils.HttpError(
            412,
            'Bad implementation for media library, the service provider need the function: setConfig'
          );
        await setActiveProvider(providerName, { transacting });
        return provider.services.provider.setConfig(config, { transacting });
      }
      throw new global.utils.HttpError(412, `The provider "${providerName}" not found`);
    },
    tables.settings,
    _transacting
  );
}

module.exports = { setProviderConfig };
