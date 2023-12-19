const { randomString } = require('@leemons/utils');

/**
 * Checks if the provided S3 bucket has the necessary permissions.
 *
 * @param {Object} s3 - The AWS S3 instance.
 * @param {Object} config - The configuration object containing the bucket details.
 */
const hasPermissions = async (s3, config, ctx) => {
  try {
    const Key = `leemons/${ctx.meta.deploymentID}/leebrary/t${randomString(6)}.json`;
    const uploadConf = {
      Bucket: config.bucket.trim(),
      Key,
      Body: JSON.stringify({ test: true }),
      ACL: 'private',
      ContentType: 'application/json; charset=utf-8',
    };

    await s3.putObject(uploadConf).promise();

    await s3
      .deleteObject({
        Bucket: config.bucket.trim(),
        Key,
      })
      .promise();

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { hasPermissions };
