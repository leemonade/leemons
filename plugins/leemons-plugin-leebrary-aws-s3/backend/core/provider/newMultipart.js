const _ = require('lodash');
const { getS3AndConfig } = require('./getS3AndConfig');

/**
 * This function initializes a new multipart upload in AWS S3.
 * If the file is a folder, it creates a multipart upload for each file path.
 * If the file is not a folder, it creates a single multipart upload.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.file - The file data object from the database. It should contain the file's id and whether it is a folder.
 * @param {Array<string>} params.filePaths - An array of file paths. Only used if the file is a folder.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database and to get the AWS S3 configuration.
 * @returns {Promise<string>} Returns a promise that resolves to the key of the created multipart upload(s).
 */
async function newMultipart({ file, filePaths, ctx } = {}) {
  const { s3, config } = await getS3AndConfig({ ctx });

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
        ctx.tx.db.MultipartUploads.create({
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

  await ctx.tx.db.MultipartUploads.create({
    fileId: file.id,
    uploadId: res.UploadId,
  });

  return Key;
}

module.exports = { newMultipart };
