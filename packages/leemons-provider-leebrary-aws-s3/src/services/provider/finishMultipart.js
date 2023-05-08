const _ = require('lodash');
const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function finishMultipart(dbfile, { transacting } = {}) {
  const [multipartConfig, etags] = await Promise.all([
    table.multipartUploads.findOne(
      {
        fileId: dbfile.id,
      },
      { transacting }
    ),
    table.multipartEtag.find(
      {
        fileId: dbfile.id,
      },
      { transacting }
    ),
  ]);
  if (!multipartConfig) {
    throw new Error('No started multipart upload for this file');
  }
  if (etags.length < 1) {
    throw new Error('No part files sends yet');
  }

  const { s3, config } = await getS3AndConfig({ transacting });

  const MultipartUpload = {
    Parts: [],
  };

  _.forEach(etags, ({ etag, partNumber }) => {
    MultipartUpload.Parts[partNumber - 1] = {
      ETag: etag,
      PartNumber: partNumber,
    };
  });

  await s3
    .completeMultipartUpload({
      Bucket: config.bucket,
      Key: dbfile.uri,
      MultipartUpload,
      UploadId: multipartConfig.uploadId,
    })
    .promise();

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

  return true;
}

module.exports = { finishMultipart };
