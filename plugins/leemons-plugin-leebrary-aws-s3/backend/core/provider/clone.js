const { getS3AndConfig } = require('./getS3AndConfig');

/**
 * This function clones an item from an AWS S3 bucket to another location within the same bucket.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.itemFrom - The source item to be cloned. It should have 'id' and 'extension' properties.
 * @param {Object} params.itemTo - The destination of the cloned item. It should have 'id' and 'extension' properties.
 * @param {string} params.toFolder - The folder where the item will be cloned. Default is 'leebrary'.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database.
 * @returns {Promise<String>} The key of the cloned item in the S3 bucket.
 */
async function clone({ itemFrom, itemTo, ctx, toFolder = 'leebrary' } = {}) {
  const { s3, config } = await getS3AndConfig({ ctx });

  const Key = `leemons/${ctx.meta.deploymentID}/${toFolder}/${itemTo.id}.${itemTo.extension}`;

  await s3
    .copyObject({
      CopySource: `${config.bucket}/leemons/${ctx.meta.deploymentID}/leebrary/${itemFrom.id}.${itemFrom.extension}`,
      Bucket: config.bucket,
      Key,
    })
    .promise();

  return Key;
}

module.exports = { clone };
