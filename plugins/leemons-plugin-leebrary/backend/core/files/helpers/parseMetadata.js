/**
 * Parse the metadata of a file item
 * @param {Object} item - The file item.
 * @returns {Object} The file item with parsed metadata.
 */
function parseMetadata(item) {
  const data = { ...item };
  if (data.metadata) data.metadata = JSON.parse(data.metadata);
  return data;
}

module.exports = { parseMetadata };
