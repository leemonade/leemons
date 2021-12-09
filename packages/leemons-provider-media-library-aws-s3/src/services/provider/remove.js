const { getS3AndConfig } = require('./getS3AndConfig');

async function remove(Key, { transacting } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });

  await s3
    .deleteObject({
      Bucket: config.bucket,
      Key,
    })
    .promise();

  return true;
}

module.exports = { remove };
