const { getS3AndConfig } = require('./getS3AndConfig');

async function upload(item, buffer, { transacting } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });

  const Key = `leemons/leebrary/${item.id}.${item.extension}`;
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
