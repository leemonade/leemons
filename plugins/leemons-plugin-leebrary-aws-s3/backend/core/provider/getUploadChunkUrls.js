const { getS3AndConfig } = require('./getS3AndConfig');

async function getUploadChunkUrls({ file, nChunks, path, ctx } = {}) {
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

  const partNumbers = [...Array(nChunks).keys()];

  return Promise.all(
    partNumbers.map((partNumber) =>
      s3.getSignedUrlPromise('uploadPart', {
        Bucket: config.bucket,
        Key,
        PartNumber: partNumber + 1,
        UploadId: multipartConfig.uploadId,
        Expires: 60 * 60,
      })
    )
  );

  /*
const eQuery = { fileId: file.id, partNumber };
const eSave = { fileId: file.id, partNumber, etag: res.ETag };

if (file.isFolder) {
  eQuery.path = path;
  eSave.path = path;
}

await ctx.tx.db.MultipartEtag.updateOne(eQuery, eSave, { upsert: true });

   */

  return true;
}

module.exports = { getUploadChunkUrls };
