const fs = require('fs');
const { LeemonsError } = require('leemons-error');

const { getById } = require('./getById');

/**
 * Retrieves file data for returning the file in the response.
 *
 * @async
 * @function dataForReturnFile
 * @param {Object} options - Input options.
 * @param {string} options.id - The ID of the file to retrieve data for.
 * @param {number} [options.start=-1] - The starting byte position for reading the file.
 * @param {number} [options.end=-1] - The ending byte position for reading the file.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object>} Object containing file data and read stream for the response.
 * @throws {LeemonsError} If the file with the specified ID does not exist.
 */
async function dataForReturnFile({ id, start = -1, end = -1, ctx }) {
  const file = await getById({ id, ctx });

  if (!file) {
    throw new LeemonsError(ctx, {
      message: `File with id ${id} does not exists`,
      httpStatusCode: 422,
    });
  }

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

  // Default provider
  if (file.provider === 'sys') {
    return {
      file,
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: fs.createReadStream(file.uri, readParams),
    };
  }

  // Other providers
  // TODO Roberto: Hay que repensar esta lógica en la que se solicita los plugins Providers de un determinado plugin
  // Lanzo el error aposta
  throw new Error('TODO: HAY QUE REPENSAR LA LÓGICA DE LOS PROVIDERS');
  //! Dejo comentado el código "antiguo"
  /*
  const provider = leemons.getProvider(file.provider);
  if (provider?.services?.provider?.getReadStream) {
    return {
      file,
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: await provider.services.provider.getReadStream(file.uri, {
        transacting,
        start: bytesStart,
        end: bytesEnd,
      }),
    };
  }
  throw new global.utils.HttpError(400, `Provider "${file.provider}" not found`);
  */
}

module.exports = { dataForReturnFile };
