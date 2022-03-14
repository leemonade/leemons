const fs = require('fs');
const { getById } = require('./getById');

async function dataForReturnFile(id, { transacting } = {}) {
  const file = await getById(id, { transacting });

  if (!file) {
    throw new Error(`File with id ${id} does not exists`);
  }

  // Default provider
  if (file.provider === 'sys') {
    return {
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: fs.createReadStream(file.uri),
    };
  }

  // Other providers
  const provider = leemons.getProvider(file.provider);
  if (provider?.services?.provider?.getReadStream) {
    return {
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
      readStream: await provider.services.provider.getReadStream(file.uri, { transacting }),
    };
  }

  throw new Error(`Provider "${file.provider}" not found`);
}

module.exports = { dataForReturnFile };
