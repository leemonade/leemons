const _ = require('lodash');
const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function abortMultipart(dbfile, { transacting } = {}) {
  const multipartConfig = await table.multipartUploads.findOne(
    {
      fileId: dbfile.id,
    },
    { transacting }
  );
  if (!multipartConfig) {
    throw new Error('No started multipart upload for this file');
  }

  const { s3, config } = await getS3AndConfig({ transacting });

  await table.multipartUploads.deleteMany(
    {
      fileId: dbfile.id,
    },
    { transacting }
  );

  await table.multipartEtag.deleteMany(
    {
      fileId: dbfile.id,
    },
    { transacting }
  );

  await s3
    .abortMultipartUpload({
      Bucket: config.bucket,
      Key: dbfile.uri,
      UploadId: multipartConfig.uploadId,
    })
    .promise();

  return true;
}

module.exports = { abortMultipart };
