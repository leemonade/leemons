const { getS3AndConfig } = require('./getS3AndConfig');

/**
 * This function is used to get a read stream from an S3 bucket.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.key - The key of the object in the S3 bucket.
 * @param {number} params.start - The starting byte of the range to read. Default is -1, which means start from the beginning.
 * @param {number} params.end - The ending byte of the range to read. Default is -1, which means read to the end.
 * @param {boolean} params.forceStream - If true, the function will return a stream. If false, it will return a presigned URL. Default is true.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database.
 * @returns {Promise<Stream|string>} - Returns a read stream if forceStream is true, otherwise returns a presigned URL.
 */
async function getReadStream({ key: Key, start = -1, end = -1, forceStream = true, ctx } = {}) {
  const { s3, config } = await getS3AndConfig({ ctx });
  const params = {
    Bucket: config.bucket,
    Key,
  };

  if (start > -1 && end > -1) {
    params.Range = `bytes=${start}-${end}`;
  }

  if (forceStream) {
    const result = await s3.getObject(params).promise();
    return result?.Body;
  }

  // Generate a presigned URL for the S3 object
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('getObject', {
    ...params,
    Expires: signedUrlExpireSeconds,
  });
}

module.exports = { getReadStream };
