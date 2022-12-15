const { getS3AndConfig } = require('./getS3AndConfig');

async function clone(itemFrom, itemTo, { transacting } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });

  const Key = `leemons/leebrary/${itemTo.id}.${itemTo.extension}`;

  await s3
    .copyObject({
      CopySource: `${config.bucket}/leemons/leebrary/${itemFrom.id}.${itemFrom.extension}`,
      Bucket: config.bucket,
      Key,
    })
    .promise();

  return Key;
}

module.exports = { clone };
