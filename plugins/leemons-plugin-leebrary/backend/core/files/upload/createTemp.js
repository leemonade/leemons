const temp = require('temp');
const fs = require('fs');
const { isReadableStream } = require('./isReadableStream');
const { streamToBuffer } = require('./streamToBuffer');
/**
 * Creates a temporary file from a readable stream or a buffer.
 *
 * @param {object} params - The params object.
 * @param {stream.Readable|Buffer} params.readStream - The readable stream or buffer.
 * @param {string} params.contentType - The content type of the file.
 * @returns {Promise<Object>} A promise that resolves with an object containing the path and content type of the temporary file.
 */
function createTemp({ readStream, contentType }) {
  return new Promise((resolve, reject) => {
    temp.open('leebrary', async (err, info) => {
      if (err) {
        reject(err);
      }

      let dataToWrite = readStream?.type === 'Buffer' ? Buffer.from(readStream) : readStream;

      if (isReadableStream(dataToWrite)) {
        dataToWrite = await streamToBuffer(dataToWrite);
      }

      fs.write(info.fd, dataToWrite, (e) => {
        if (e) {
          reject(e);
        }

        fs.close(info.fd, (error) => {
          if (error) {
            reject(error);
          }
          resolve({ path: info.path, contentType });
        });
      });
    });
  });
}

module.exports = { createTemp };
