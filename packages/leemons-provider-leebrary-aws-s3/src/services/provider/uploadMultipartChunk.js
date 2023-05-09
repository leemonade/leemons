const { table } = require('../tables');
const { getS3AndConfig } = require('./getS3AndConfig');

async function uploadMultipartChunk(dbfile, partNumber, buffer, path, { transacting } = {}) {
  let Key = dbfile.uri;
  const query = { fileId: dbfile.id };

  if (dbfile.isFolder) {
    query.path = path;
    Key += `/${path}`;
  }

  const multipartConfig = await table.multipartUploads.findOne(query, { transacting });
  if (!multipartConfig) {
    throw new Error('No started multipart upload for this file');
  }

  const { s3, config } = await getS3AndConfig({ transacting });

  const res = await s3
    .uploadPart({
      Body: buffer,
      Bucket: config.bucket,
      Key,
      PartNumber: String(partNumber),
      UploadId: multipartConfig.uploadId,
    })
    .promise();

  const eQuery = { fileId: dbfile.id, partNumber };
  const eSave = { fileId: dbfile.id, partNumber, etag: res.ETag };
  if (dbfile.isFolder) {
    eQuery.path = path;
    eSave.path = path;
  }

  await table.multipartEtag.set(eQuery, eSave, { transacting });

  return true;
}

module.exports = { uploadMultipartChunk };
