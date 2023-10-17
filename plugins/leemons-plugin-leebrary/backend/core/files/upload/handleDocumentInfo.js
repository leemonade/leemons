const document = require('office-document-properties');
const { getMetaProps } = require('./getMetaProps');

/**
 * Handles the document information and extracts metadata if it's a docx, docm, pptx, pptm, xlsx, or xlsm file.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.metadata - The metadata of the file.
 * @param {string} params.path - The path of the file.
 * @param {string} params.extension - The extension of the file.
 * @returns {Promise<Object>} The metadata of the file.
 */
async function handleDocumentInfo({ metadata, path, extension }) {
  if (['docx', 'docm', 'pptx', 'pptm', 'xlsx', 'xlsm'].includes(extension)) {
    const props = await new Promise((resolve, reject) => {
      document.fromFilePath(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    // eslint-disable-next-line no-param-reassign
    metadata = getMetaProps({ data: props, result: metadata });
  }

  return metadata;
}

module.exports = { handleDocumentInfo };
