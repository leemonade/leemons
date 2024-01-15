/* eslint-disable no-await-in-loop */
const { isEmpty, isNil } = require('lodash');
const chalk = require('chalk');
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
      try {
        await ctx.call('mqtt-aws-iot.socket.setConfig', {
          region: providers.iot.region || euCentralOneRegion,
          accessKeyId: providers.iot.accessKey,
          secretAccessKey: providers.iot.secretAccessKey,
        });
      } catch (err) {
        ctx.logger.error(chalk`{red.bold BULK} Error setting MQTT AWS IOT config: ${err.message}`);
      }
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
      try {
        await ctx.call('leebrary.settings.setProviderConfig', {
          providerName: storageProvider,
          config: storageConfig,
        });
      } catch (err) {
        ctx.logger.error(
          chalk`{red.bold BULK} Error setting storage provider config: ${err.message}`
        );
      }
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
      try {
        await ctx.call('emails.email.addProvider', {
          providerName: emailProvider,
          config: emailConfig,
        });
      } catch (err) {
        ctx.logger.error(
          chalk`{red.bold BULK} Error setting email provider config: ${err.message}`
        );
      }
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

      try {
        await ctx.call('emails.email.addProvider', {
          providerName: smtpEmailProvider,
          config: emailConfig,
        });
      } catch (err) {
        ctx.logger.error(
          chalk`{red.bold BULK} Error setting email provider config: ${err.message}`
        );
      }
    }

    return providers;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initProviders;
