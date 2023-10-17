/**
 * Converts a readable stream into a buffer.
 *
 * @param {stream.Readable} readStream - The readable stream to convert.
 * @returns {Promise<Buffer>} A promise that resolves with the buffer.
 */
function streamToBuffer(readStream) {
  return new Promise((resolve, reject) => {
    const data = [];

    readStream.on('data', (chunk) => {
      data.push(chunk);
    });

    readStream.on('end', () => {
      resolve(Buffer.concat(data));
    });

    readStream.on('error', (err) => {
      reject(err);
    });
  });
}
module.exports = { streamToBuffer };
