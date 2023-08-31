const _ = require('lodash');
const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function abortMultipart(dbfile, { transacting } = {}) {
  const multipartConfig = await table.multipartUploads.find(
    {
      fileId: dbfile.id,
    },
    { transacting }
  );
  if (!multipartConfig.length) {
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

  await Promise.all(
    _.map(multipartConfig, (conf) =>
      s3
        .abortMultipartUpload({
          Bucket: config.bucket,
          Key: dbfile.isFolder ? `${dbfile.uri}/${conf.path}` : dbfile.uri,
          UploadId: conf.uploadId,
        })
        .promise()
    )
  );

  return true;
}

module.exports = { abortMultipart };
