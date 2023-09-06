const _ = require('lodash');
const { getS3AndConfig } = require('./getS3AndConfig');

/**
 * This function aborts a multipart upload in AWS S3.
 * It first checks if there is a started multipart upload for the given file in the database.
 * If there is, it deletes the multipart upload records and the associated Etag records from the database.
 * Then, it sends a request to AWS S3 to abort the multipart upload.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.file - The file data object from the database. It should contain the file's id and uri.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database and to get the AWS S3 configuration.
 * @returns {Promise<boolean>} Returns a promise that resolves to true when the operation is successful.
 */
async function abortMultipart({ file, ctx } = {}) {
  const multipartConfig = await ctx.tx.db.MultipartUploads.find({
    fileId: file.id,
  }).lean();

  if (!multipartConfig.length) {
    throw new Error('No started multipart upload for this file');
  }

  const { s3, config } = await getS3AndConfig({ ctx });

  await ctx.tx.db.MultipartUploads.deleteMany({
    fileId: file.id,
  });

  await ctx.tx.db.MultipartEtag.deleteMany({
    fileId: file.id,
  });

  await Promise.all(
    _.map(multipartConfig, (conf) =>
      s3
        .abortMultipartUpload({
          Bucket: config.bucket,
          Key: file.isFolder ? `${file.uri}/${conf.path}` : file.uri,
          UploadId: conf.uploadId,
        })
        .promise()
    )
  );

  return true;
}

module.exports = { abortMultipart };
