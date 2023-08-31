const fs = require('fs');
const mime = require('mime-types');
const { getById } = require('./getById');

async function dataForReturnFile(
  id,
  { path = '', transacting, start = -1, end = -1, forceStream = true } = {}
) {
  const file = await getById(id, { transacting });

  if (!file) {
    throw new global.utils.HttpError(422, `File with id ${id} does not exists`);
  }

  if (file.metadata?.pathsInfo && path) {
    if (file.metadata?.pathsInfo?.[path]) {
      file.size = file.metadata.pathsInfo[path].size;
    }
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

  const common = {
    file,
    contentType: path ? mime.lookup(path.split('.').reverse()[0]) : file.type,
    fileName: path ? path.split('/').reverse()[0] : `${file.name}.${file.extension}`,
  };

  // Default provider
  if (file.provider === 'sys') {
    return {
      ...common,
      readStream: fs.createReadStream(file.uri + (path ? `/${path}` : ''), readParams),
    };
  }

  // Other providers
  const provider = leemons.getProvider(file.provider);
  if (provider?.services?.provider?.getReadStream) {
    return {
      ...common,
      readStream: await provider.services.provider.getReadStream(
        file.uri + (path ? `/${path}` : ''),
        {
          transacting,
          start: bytesStart,
          end: bytesEnd,
          forceStream,
        }
      ),
    };
  }

  throw new global.utils.HttpError(400, `Provider "${file.provider}" not found`);
}

module.exports = { dataForReturnFile };
