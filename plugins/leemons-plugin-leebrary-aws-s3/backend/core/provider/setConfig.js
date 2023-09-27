const aws = require('aws-sdk');
const { hasPermissions } = require('./hasPermissions');

/**
 * This function sets the configuration for AWS S3 and returns the updated configuration object.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.config - The new configuration for AWS S3.
 * @param {Object} params.ctx - The context object.
 * @returns {Promise<Object>} The updated or newly created configuration object.
 */
async function setConfig({ config, ctx } = {}) {
  const configs = await ctx.tx.db.Config.find({}).lean();

  const options = {
    accessKeyId: config.accessKey.trim(),
    secretAccessKey: config.secretAccessKey.trim(),
    region: config.region.trim(),
  };

  const s3 = new aws.S3(options);

  try {
    const hasPermission = await hasPermissions(s3, config);
    // Si el bucket no existe intentamos crearlo
    if (!hasPermission) {
      await s3
        .createBucket({
          Bucket: config.bucket.trim(),
          CreateBucketConfiguration: {
            LocationConstraint: config.region.trim(),
          },
        })
        .promise();
    }
  } catch (e) {
    throw new Error(
      'The bucket does not exist or there are no permissions to upload/read/delete files.'
    );
  }

  if (configs.length > 0) {
    return ctx.tx.db.Config.findOneAndUpdate({ id: configs[0].id }, config, {
      new: true,
      lean: true,
    });
  }

  const result = await ctx.tx.db.Config.create(config);
  return result.toObject();
}

module.exports = { setConfig };
