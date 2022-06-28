/* eslint-disable no-await-in-loop */
const { isEmpty } = require('lodash');
const importProviders = require('./bulk/providers');

async function initProviders() {
  try {
    const providers = await importProviders();
    const storageProvider = 'leebrary-aws-s3';
    const emailProvider = 'emails-amazon-ses';

    // ·····································
    // STORAGE PROVIDER
    if (
      providers.storage &&
      providers.storage.provider === storageProvider &&
      !isEmpty(providers.storage.accessKey) &&
      !isEmpty(providers.storage.secretAccessKey)
    ) {
      const storageConfig = {
        bucket: providers.storage.bucket,
        region: providers.storage.region || 'eu-central-1',
        accessKey: providers.storage.accessKey,
        secretAccessKey: providers.storage.secretAccessKey,
      };

      await leemons
        .getPlugin('leebrary')
        .services.settings.setProviderConfig(storageProvider, storageConfig);
    }

    // ·····································
    // EMAIL PROVIDER
    if (
      providers.email &&
      providers.email.provider === emailProvider &&
      !isEmpty(providers.email.accessKey) &&
      !isEmpty(providers.email.secretAccessKey)
    ) {
      const emailConfig = {
        name: providers.email.name,
        region: providers.email.region || 'eu-central-1',
        accessKey: providers.email.accessKey,
        secretAccessKey: providers.email.secretAccessKey,
      };

      await leemons
        .getPlugin('emails')
        .services.email.addProvider({ providerName: emailProvider, config: emailConfig });
    }

    return providers;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initProviders;
