const got = require('got');
/**
 * Fetches the content type of a remote file.
 *
 * @param {string} url - The URL of the remote file.
 * @returns {Promise<string>} The content type of the remote file.
 */
function getRemoteContentType(url) {
  return new Promise((resolve, reject) => {
    try {
      got(url, { isStream: true })
        .on('response', (response) => {
          response.destroy();
          resolve(response.headers['content-type']);
        })
        .on('error', (error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });
}
module.exports = { getRemoteContentType };
