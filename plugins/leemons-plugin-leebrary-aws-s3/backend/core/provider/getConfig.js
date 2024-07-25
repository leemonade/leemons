const { getAWSCredentials } = require('@leemons/aws/src');

/**
 * This function retrieves the first configuration object from the database.
 * If no configuration objects are found, it returns null.
 *
 * @param {Object} params - The parameters object.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database.
 * @returns {Promise<Object|null>} The first configuration object from the database, or null if no configurations are found.
 */
async function getConfig({ ctx } = {}) {
  let configs = [];

  const credentials = await getAWSCredentials({ prefix: 'S3', ctx });

  if (credentials) {
    configs = [
      {
        id: 'leebrary-aws-s3',
        deploymentID: ctx.meta.deploymentID,
        bucket: process.env.AWS_S3_BUCKET,
        region: credentials.region,
        accessKey: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      },
    ];
  } else {
    console.error('=============================================');
    console.error('[AWS S3] No credentials found in @leemons/aws');
    console.error('=============================================');

    configs = await ctx.tx.db.Config.find({}).lean();
  }
  if (configs.length > 0) return configs[0];
  return null;
}

module.exports = { getConfig };
