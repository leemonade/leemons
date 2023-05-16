const { getS3AndConfig } = require('./getS3AndConfig');

async function getReadStream(Key, { transacting, start = -1, end = -1 } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });
  const params = {
    Bucket: config.bucket,
    Key,
  };

  if (start > -1 && end > -1) {
    params.Range = `bytes=${start}-${end}`;
  }

  const result = await s3.getObject(params).promise();

  return result.Body;
}

module.exports = { getReadStream };
