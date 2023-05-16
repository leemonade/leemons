const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function newMultipart(file, { transacting } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });
  const Key = `leemons/leebrary/${file.id}.${file.extension}`;
  const res = await s3
    .createMultipartUpload({
      Bucket: config.bucket,
      Key,
    })
    .promise();

  await table.multipartUploads.create({
    fileId: file.id,
    uploadId: res.UploadId,
  });

  return Key;
}

module.exports = { newMultipart };
