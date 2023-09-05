const aws = require('aws-sdk');
const { getConfig } = require('./getConfig');

/**
 * Retrieves the configuration for the AWS S3 service and initializes an S3 instance.
 *
 * @param {Object} params - The parameters object.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database.
 * @returns {Object|null} An object containing the initialized S3 instance and the configuration, or null if no configuration was found.
 */
async function getS3AndConfig({ ctx }) {
  const config = await getConfig({ ctx });
  if (config) {
    return {
      s3: new aws.S3({
        accessKeyId: config.accessKey.trim(),
        secretAccessKey: config.secretAccessKey.trim(),
        region: config.region.trim(),
      }),
      config,
    };
  }
  return null;
}

module.exports = { getS3AndConfig };
