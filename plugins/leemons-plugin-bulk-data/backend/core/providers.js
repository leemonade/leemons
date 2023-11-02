/* eslint-disable no-await-in-loop */
const { isEmpty, isNil } = require('lodash');
const importProviders = require('./bulk/providers');

async function initProviders({ file, ctx }) {
  const euCentralOneRegion = 'eu-central-1';
  try {
    const providers = await importProviders(file);
    const storageProvider = 'leebrary-aws-s3';
    const emailProvider = 'emails-aws-ses';
    const smtpEmailProvider = 'emails-smtp';
    const mqttAwsIot = 'mqtt-aws-iot';

    // ·····································
    // MQTT AWS IOT
    if (
      providers.iot &&
      providers.iot.provider === mqttAwsIot &&
      !isEmpty(providers.storage.accessKey) &&
      !isEmpty(providers.storage.secretAccessKey)
    ) {
      await ctx.call('mqtt-aws-iot.socket.setConfig', {
        region: providers.iot.region || euCentralOneRegion,
        accessKeyId: providers.iot.accessKey,
        secretAccessKey: providers.iot.secretAccessKey,
      });
    }

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
        region: providers.storage.region || euCentralOneRegion,
        accessKey: providers.storage.accessKey,
        secretAccessKey: providers.storage.secretAccessKey,
      };

      await ctx.call('leebrary.settings.setProviderConfig', {
        providerName: storageProvider,
        config: storageConfig,
      });
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
        region: providers.email.region || euCentralOneRegion,
        accessKey: providers.email.accessKey,
        secretAccessKey: providers.email.secretAccessKey,
      };

      await ctx.call('emails.email.addProvider', {
        providerName: emailProvider,
        config: emailConfig,
      });
    }

    if (
      providers.email &&
      providers.email.provider === smtpEmailProvider &&
      !isNil(providers.email.smtpPort) &&
      !isEmpty(providers.email.smtpHost) &&
      !isEmpty(providers.email.smtpUser)
    ) {
      const emailConfig = {
        name: providers.email.name,
        secure: providers.email.smtpSecure ?? false,
        port: providers.email.smtpPort ?? 25,
        host: providers.email.smtpHost,
        user: providers.email.smtpUser,
        pass: providers.email.smtpPass,
      };

      await ctx.call('emails.email.addProvider', {
        providerName: smtpEmailProvider,
        config: emailConfig,
      });
    }

    return providers;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initProviders;
