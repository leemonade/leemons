const temp = require('temp');
const fs = require('fs');

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

/**
 * Creates a temporary file from a readable stream or a buffer.
 *
 * @param {object} params - The params object.
 * @param {stream.Readable} params.readStream - The readable stream.
 * @returns {Promise<Object>} A promise that resolves with an object containing the path of the temporary file.
 */
function createTempFile({ readStream }) {
  return new Promise((resolve, reject) => {
    temp.open('bulk-data', async (err, info) => {
      if (err) {
        reject(err);
      }
      const dataToWrite = await streamToBuffer(readStream);

      fs.write(info.fd, dataToWrite, (e) => {
        if (e) {
          reject(e);
        }

        fs.close(info.fd, (error) => {
          if (error) {
            reject(error);
          }
          resolve({ path: info.path });
        });
      });
    });
  });
}

module.exports = { createTempFile };
