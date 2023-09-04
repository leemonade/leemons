/* eslint-disable no-param-reassign */
const fs = require('fs');
const mime = require('mime-types');
const { getById } = require('./getById');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Get the file size from metadata if available
 *
 * @param {Object} params - The params object
 * @param {Object} params.file - The file object
 * @param {string} params.path - The path of the file
 * @returns {Object} The updated file object
 */
function prepareFileSizeFromMetadata({ file, path }) {
  if (file.metadata?.pathsInfo?.[path]) {
    file.size = file.metadata.pathsInfo[path].size;
  }

  return file;
}

/**
 * Get the read parameters for the file
 *
 * @param {Object} params - The params object
 * @param {Object} params.file - The file object
 * @param {number} params.start - The start byte
 * @param {number} params.end - The end byte
 * @returns {Object} The read parameters
 */
function getReadParams({ file, start, end }) {
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

/**
 * Get the common file details
 *
 * @param {Object} params - The params object
 * @param {Object} params.file - The file object
 * @param {string} params.path - The path of the file
 * @returns {Object} The common file details
 */
function getCommonFileDetails({ file, path }) {
  return {
    file,
    contentType: path ? mime.lookup(path.split('.').reverse()[0]) : file.type,
    fileName: path ? path.split('/').reverse()[0] : `${file.name}.${file.extension}`,
  };
}

/**
 * Get the read stream for the file
 *
 * @param {Object} params - The params object
 * @param {Object} params.file - The file object
 * @param {string} params.path - The path of the file
 * @param {Object} params.readParams - The read parameters
 * @param {object} params.transacting - The transaction object
 * @param {number} params.bytesStart - The start byte
 * @param {number} params.bytesEnd - The end byte
 * @param {boolean} params.forceStream - The force stream flag
 * @returns {Promise<Object>} The read stream
 */
async function getReadStream({
  file,
  path,
  readParams,
  transacting,
  bytesStart,
  bytesEnd,
  forceStream,
}) {
  let readStream;

  // Default provider
  if (file.provider === 'sys') {
    readStream = fs.createReadStream(file.uri + (path ? `/${path}` : ''), readParams);
  }

  // Other providers
  const provider = leemons.getProvider(file.provider);
  if (provider?.services?.provider?.getReadStream) {
    readStream = await provider.services.provider.getReadStream(
      file.uri + (path ? `/${path}` : ''),
      {
        transacting,
        start: bytesStart,
        end: bytesEnd,
        forceStream,
      }
    );
  }

  return readStream;
}
// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Prepares the necessary data for returning a file.
 * It fetches the file by its ID, prepares the file size from metadata, gets common file details, and read parameters.
 * It then gets the read stream for the file. If the read stream is not found, it throws an error.
 * Otherwise, it returns an object containing common file details and the read stream.
 *
 * @async
 * @param {string} id - The id of the file
 * @param {Object} options - The options for the file, including path, transacting, start, end, and forceStream
 * @returns {Promise<Object>} The data for returning the file, including common file details and the read stream
 */
async function dataForReturnFile(
  id,
  { path = '', transacting, start = -1, end = -1, forceStream = true } = {}
) {
  let file = await getById(id, { transacting });

  if (!file) {
    throw new global.utils.HttpError(422, `File with id ${id} does not exists`);
  }

  file = prepareFileSizeFromMetadata({ file, path });

  const common = getCommonFileDetails({ file, path });
  const { bytesStart, bytesEnd, readParams } = getReadParams({ file, start, end });
  const readStream = await getReadStream({
    file,
    path,
    readParams,
    transacting,
    bytesStart,
    bytesEnd,
    forceStream,
  });

  if (!readStream) {
    throw new global.utils.HttpError(400, `Provider "${file.provider}" not found`);
  }

  return { ...common, readStream };
}

module.exports = { dataForReturnFile };
