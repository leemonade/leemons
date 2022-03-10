const { getS3AndConfig } = require('./getS3AndConfig');

async function getReadStream(Key, { transacting } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });

  const result = await s3
    .getObject({
      Bucket: config.bucket,
      Key,
    })
    .promise();

  return result.Body;
}

module.exports = { getReadStream };
