/**
 * Get the read parameters for the file
 *
 * @param {Object} params - The params object
 * @param {LibraryFile} params.file - The file object
 * @param {number} params.start - The start byte
 * @param {number} params.end - The end byte
 * @returns {Object} The read parameters
 */
function handleReadParams({ file, start, end }) {
  let bytesStart = start;
  let bytesEnd = end;
  let readParams = {};

  if (file.size > 0 && bytesStart > -1 && bytesEnd > -1) {
    bytesEnd = Math.min(file.size - 1, bytesEnd);
    readParams = {
      emitClose: false,
      flags: 'r',
      start: bytesStart,
      end: bytesEnd,
    };
  } else {
    bytesStart = -1;
    bytesEnd = -1;
  }

  return { bytesStart, bytesEnd, readParams };
}

module.exports = {
  handleReadParams,
};
