const _ = require('lodash');
const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function newMultipart(file, { filePaths, transacting } = {}) {
  const { s3, config } = await getS3AndConfig({ transacting });

  if (file.isFolder) {
    const Key = `leemons/leebrary/${file.id}`;

    const responses = await Promise.all(
      _.map(filePaths, (path) =>
        s3
          .createMultipartUpload({
            Bucket: config.bucket,
            Key: `${Key}/${path}`,
          })
          .promise()
      )
    );

    await Promise.all(
      _.map(filePaths, (path, index) =>
        table.multipartUploads.create({
          fileId: file.id,
          uploadId: responses[index].UploadId,
          path,
        })
      )
    );
    return Key;
  }
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
