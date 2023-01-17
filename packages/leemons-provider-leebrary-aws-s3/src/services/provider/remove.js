const { getS3AndConfig } = require('./getS3AndConfig');

async function remove(Key, { transacting } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });

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
