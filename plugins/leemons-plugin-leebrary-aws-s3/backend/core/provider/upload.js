const { getS3AndConfig } = require('./getS3AndConfig');

/**
 * This function uploads a file to AWS S3.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.item - The item object containing the id and extension of the file.
 * @param {Buffer} params.buffer - The buffer containing the file data.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database and to get the AWS S3 configuration.
 * @returns {Promise<string>} - Returns the key of the uploaded file.
 */
async function upload({ item, buffer, ctx } = {}) {
  const { s3, config } = await getS3AndConfig({ ctx });

  const Key = `leemons/${ctx.meta.deploymentID}/leebrary/${item.id}.${item.extension}`;
  await s3
    .putObject({
      Bucket: config.bucket,
      Key,
      Body: buffer,
      ACL: 'private',
      ContentType: item.type,
    })
    .promise();

  return Key;
}

module.exports = { upload };
