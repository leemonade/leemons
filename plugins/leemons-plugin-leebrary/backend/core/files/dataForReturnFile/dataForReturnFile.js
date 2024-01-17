const { LeemonsError } = require('@leemons/error');
const { getById } = require('../getById/getById');
const { handleCommonFileDetails } = require('./handleCommonFileDetails');
const { handleReadParams } = require('./handleReadParams');
const { handleReadStream } = require('./handleReadStream');

/**
 * Prepares the necessary data for returning a file.
 * It fetches the file by its ID, prepares the file size from metadata, gets common file details, and read parameters.
 * It then gets the read stream for the file. If the read stream is not found, it throws an error.
 * Otherwise, it returns an object containing common file details and the read stream.
 *
 * @async
 * @param {Object} params - The parameters for the function.
 * @param {string} params.id - The id of the file.
 * @param {string} [params.path=''] - The path of the file.
 * @param {number} [params.start=-1] - The starting byte position for the read stream.
 * @param {number} [params.end=-1] - The ending byte position for the read stream.
 * @param {boolean} [params.forceStream=true] - Whether to force the use of a stream even if the file could be loaded into memory.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The data for returning the file, including common file details and the read stream.
 * @throws {LeemonsError} If the read stream is not found or the file with the given id does not exist.
 */
async function dataForReturnFile({
  id,
  path = '',
  start = -1,
  end = -1,
  forceStream = true,
  ctx,
} = {}) {
  const file = await getById({ id, ctx });

  if (!file) {
    throw new LeemonsError(ctx, {
      message: `File with id ${id} does not exists`,
      httpStatusCode: 422,
    });
  }

  if (file.metadata?.pathsInfo?.[path]) {
    file.size = file.metadata.pathsInfo[path].size;
  }

  const { bytesStart, bytesEnd, readParams } = handleReadParams({ file, start, end });

  const readStream = await handleReadStream({
    file,
    path,
    readParams,
    bytesStart,
    bytesEnd,
    forceStream,
    ctx,
  });

  if (!readStream) {
    throw new LeemonsError(ctx, {
      message: `Provider "${file.provider}" not found`,
      httpStatusCode: 400,
    });
  }

  const common = handleCommonFileDetails({ file, path });

  return { ...common, readStream };
}

module.exports = { dataForReturnFile };
