const _ = require('lodash');
const { getS3AndConfig } = require('./getS3AndConfig');

/**
 * This function completes a multipart upload to an AWS S3 bucket.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.file - The file object, which should have 'uri' and 'id' properties.
 * @param {String} params.path - The path where the file should be uploaded.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database.
 * @returns {Promise<Boolean>} Returns a promise that resolves to true when the upload is successfully completed.
 */
async function finishMultipart({ file, path, ctx } = {}) {
  let Key = file.uri;
  const query = { fileId: file?.id };

  if (file?.isFolder) {
    query.path = path;
    Key += `/${path}`;
  }

  const [multipartConfig, etags] = await Promise.all([
    ctx.tx.db.MultipartUploads.findOne(query).lean(),
    ctx.tx.db.MultipartEtag.find(query).lean(),
  ]);

  if (!multipartConfig) {
    throw new Error('No started multipart upload for this file');
  }
  if (etags.length < 1) {
    throw new Error('No part files sends yet');
  }

  const { s3, config } = await getS3AndConfig({ ctx });

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

  await ctx.tx.db.MultipartUploads.deleteMany(query);
  await ctx.tx.db.MultipartEtag.deleteMany(query);

  return true;
}

module.exports = { finishMultipart };
