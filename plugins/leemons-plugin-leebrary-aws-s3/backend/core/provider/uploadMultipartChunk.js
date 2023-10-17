const { getS3AndConfig } = require('./getS3AndConfig');

async function uploadMultipartChunk({ file, partNumber, buffer, path, ctx } = {}) {
  let Key = file.uri;
  const query = { fileId: file.id };

  if (file.isFolder) {
    query.path = path;
    Key += `/${path}`;
  }

  const multipartConfig = await ctx.tx.db.MultipartUploads.findOne(query).lean();
  if (!multipartConfig) {
    throw new Error('No started multipart upload for this file');
  }

  const { s3, config } = await getS3AndConfig({ ctx });

  const res = await s3
    .uploadPart({
      Body: buffer,
      Bucket: config.bucket,
      Key,
      PartNumber: String(partNumber),
      UploadId: multipartConfig.uploadId,
    })
    .promise();

  const eQuery = { fileId: file.id, partNumber };
  const eSave = { fileId: file.id, partNumber, etag: res.ETag };

  if (file.isFolder) {
    eQuery.path = path;
    eSave.path = path;
  }

  await ctx.tx.db.MultipartEtag.updateOne(eQuery, eSave, { upsert: true });

  return true;
}

module.exports = { uploadMultipartChunk };
