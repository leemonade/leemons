const { getS3AndConfig } = require('./getS3AndConfig');

/**
 * This function removes a file from AWS S3.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.key - The key of the file to be removed from AWS S3.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database and to get the AWS S3 configuration.
 * @returns {Promise<boolean>} - Returns true if the file is successfully removed, otherwise throws an error.
 */
async function remove({ key: Key, ctx } = {}) {
  const { s3, config } = await getS3AndConfig({ ctx });

  try {
    await s3
      .deleteObject({
        Bucket: config.bucket,
        Key,
      })
      .promise();

    return true;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to remove file from S3', { cause: e });
  }
}

module.exports = { remove };
