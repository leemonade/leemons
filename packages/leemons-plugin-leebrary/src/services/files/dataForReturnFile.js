const fs = require('fs');
const mime = require('mime-types');
const { getById } = require('./getById');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Get the file size from metadata if available
 * @param {Object} file - The file object
 * @param {string} path - The path of the file
 * @returns {Object} The updated file object
 */
function prepareFileSizeFromMetadata(file, path) {
  if (file.metadata?.pathsInfo && path) {
    if (file.metadata?.pathsInfo?.[path]) {
      file.size = file.metadata.pathsInfo[path].size;
    }
  }
  return file;
}

/**
 * Get the read parameters for the file
 * @param {Object} file - The file object
 * @param {number} start - The start byte
 * @param {number} end - The end byte
 * @returns {Object} The read parameters
 */
function getReadParams(file, start, end) {
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
 * @param {Object} file - The file object
 * @param {string} path - The path of the file
 * @returns {Object} The common file details
 */
function getCommonFileDetails(file, path) {
  return {
    file,
    contentType: path ? mime.lookup(path.split('.').reverse()[0]) : file.type,
    fileName: path ? path.split('/').reverse()[0] : `${file.name}.${file.extension}`,
  };
}

/**
 * Get the read stream for the file
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
async function getReadStream({ file, path, readParams, transacting, bytesStart, bytesEnd, forceStream }) {
  // Default provider
  if (file.provider === 'sys') {
    return fs.createReadStream(file.uri + (path ? `/${path}` : ''), readParams);
  }

  // Other providers
  const provider = leemons.getProvider(file.provider);
  if (provider?.services?.provider?.getReadStream) {
    return await provider.services.provider.getReadStream(
      file.uri + (path ? `/${path}` : ''),
      {
        transacting,
        start: bytesStart,
        end: bytesEnd,
        forceStream,
      }
    );
  }

  throw new global.utils.HttpError(400, `Provider "${file.provider}" not found`);
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Prepare the data for returning the file
 * @async
 * @param {string} id - The id of the file
 * @param {Object} options - The options for the file
 * @returns {Promise<Object>} The data for returning the file
 */
async function dataForReturnFile(
  id,
  { path = '', transacting, start = -1, end = -1, forceStream = true } = {}
) {
  let file = await getById(id, { transacting });

  if (!file) {
    throw new global.utils.HttpError(422, `File with id ${id} does not exists`);
  }

  file = prepareFileSizeFromMetadata(file, path);
  const { bytesStart, bytesEnd, readParams } = getReadParams(file, start, end);
  const common = getCommonFileDetails(file, path);
  const readStream = await getReadStream({ file, path, readParams, transacting, bytesStart, bytesEnd, forceStream });

  return {
    ...common,
    readStream,
  };
}

module.exports = { dataForReturnFile };
