const mime = require('mime-types');
const got = require('got');
const temp = require('temp');

const { getOptimizedImage } = require('./getOptimizedImage');
const { getRemoteContentType } = require('./getRemoteContentType');
/**
 * Downloads a file from a given URL and optionally compresses it if it's an image.
 *
 * @param {object} params - The params object.
 * @param {string} params.url - The URL of the file to download.
 * @param {boolean} params.compress - Whether to compress the file if it's an image.
 * @returns {Promise<Object>} A promise that resolves with an object containing the downloaded file's stream, path, and content type.
 */

function download({ url, compress }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const downloadStream = got(url, { isStream: true });
        const fileWriterStream = temp.createWriteStream();
        const contentType = await getRemoteContentType(url);

        const [fileType] = contentType.split('/');
        const extension = mime.extension(contentType);

        downloadStream.on('error', (error) => reject(error));

        fileWriterStream
          .on('error', (error) => reject(error))
          .on('finish', () => {
            fileWriterStream.end();
            resolve({ stream: fileWriterStream, path: fileWriterStream.path, contentType });
          });

        if (compress && fileType === 'image' && ['jpeg', 'jpg', 'png'].includes(extension)) {
          downloadStream.pipe(getOptimizedImage({ path: null, extension })).pipe(fileWriterStream);
        } else {
          downloadStream.pipe(fileWriterStream);
        }
      } catch (error) {
        reject(error);
      }
    })();
  });
}

module.exports = { download };
