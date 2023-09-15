const { isEmpty } = require('lodash');
/**
 * Optimizes an image by resizing it and changing its format and quality.
 *
 * @param {Object} params - The params object.
 * @param {string} params.path - The path of the image.
 * @param {string} params.extension - The extension of the image.
 * @returns {Object} The optimized image stream.
 */
function getOptimizedImage({ path, extension }) {
  let imageStream = global.utils.sharp();

  if (path && !isEmpty(path)) {
    imageStream = global.utils.sharp(path);
  }

  return imageStream
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .toFormat(extension || 'jpeg', { quality: 70 });
}
module.exports = { getOptimizedImage };
