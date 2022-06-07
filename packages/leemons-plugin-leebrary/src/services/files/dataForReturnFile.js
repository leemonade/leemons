const { getById } = require('./getById');

async function dataForReturnFile(id, { transacting } = {}) {
  const file = await getById(id, { transacting });

  if (!file) {
    throw new global.utils.HttpError(422, `File with id ${id} does not exists`);
  }

  // Default provider
  if (file.provider === 'sys') {
    return {
      file,
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: leemons.fs.createReadStream(file.uri),
    };
  }

  // Other providers
  const provider = leemons.getProvider(file.provider);
  if (provider?.services?.provider?.getReadStream) {
    return {
      file,
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: await provider.services.provider.getReadStream(file.uri, { transacting }),
    };
  }

  throw new global.utils.HttpError(400, `Provider "${file.provider}" not found`);
}

module.exports = { dataForReturnFile };
