/* eslint-disable no-param-reassign */
const { toLower } = require('lodash');

const ADMITTED_METADATA = [
  'format',
  'duration',
  // 'framerate',
  'words',
  'totaltime',
  'revision',
  'pages',
  'slides',
  'spreadsheets',
  'books',
  'height',
  'width',
  'bitrate',
  // 'channels',
];

/**
 * Extracts metadata from the provided data object and merges it into the result object.
 * Only metadata keys that are included in the ADMITTED_METADATA array are considered.
 * If a key already exists in the result object, it will not be overwritten.
 *
 * @param {Object} data - The data object containing metadata.
 * @param {Object} [result={}] - The result object to merge the metadata into.
 * @returns {Object} The result object with the merged metadata.
 */
function getMetaProps({ data, result = {} }) {
  Object.keys(data).forEach((key) => {
    const current = toLower(key);
    // Prevent next track to overwrite previous value
    if (!result[current] && ADMITTED_METADATA.includes(current)) {
      result[current] = data[key];
    }
  });

  return result;
}
module.exports = { getMetaProps };
