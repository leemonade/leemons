const _ = require('lodash');
const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function finishMultipart(dbfile, path, { transacting } = {}) {
  let Key = dbfile.uri;
  const query = { fileId: dbfile.id };
  if (dbfile.isFolder) {
    query.path = path;
    Key += `/${path}`;
  }
  const [multipartConfig, etags] = await Promise.all([
    table.multipartUploads.findOne(query, { transacting }),
    table.multipartEtag.find(query, { transacting }),
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
      Key,
      MultipartUpload,
      UploadId: multipartConfig.uploadId,
    })
    .promise();

  await table.multipartUploads.deleteMany(query, { transacting });
  await table.multipartEtag.deleteMany(query, { transacting });

  return true;
}

module.exports = { finishMultipart };
