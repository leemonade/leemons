const { getById } = require('./getById');

async function dataForReturnFile(id, { transacting, start = -1, end = -1 } = {}) {
  const file = await getById(id, { transacting });

  if (!file) {
    throw new global.utils.HttpError(422, `File with id ${id} does not exists`);
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
      readStream: leemons.fs.createReadStream(file.uri, readParams),
    };
  }

  // Other providers
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
}

module.exports = { dataForReturnFile };
