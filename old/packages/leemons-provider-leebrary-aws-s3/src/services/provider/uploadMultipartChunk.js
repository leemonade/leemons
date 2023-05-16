const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function uploadMultipartChunk(dbfile, partNumber, buffer, { transacting } = {}) {
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

  console.log(partNumber);

  const res = await s3
    .uploadPart({
      Body: buffer,
      Bucket: config.bucket,
      Key: dbfile.uri,
      PartNumber: String(partNumber),
      UploadId: multipartConfig.uploadId,
    })
    .promise();

  await table.multipartEtag.set(
    {
      fileId: dbfile.id,
      partNumber,
    },
    {
      fileId: dbfile.id,
      partNumber,
      etag: res.ETag,
    },
    { transacting }
  );

  return true;
}

module.exports = { uploadMultipartChunk };
