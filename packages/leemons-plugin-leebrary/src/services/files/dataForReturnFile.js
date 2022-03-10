const fs = require('fs');
const { files: table } = require('../tables');

async function dataForReturnFile(id, { transacting } = {}) {
  const file = await table.findOne({ id }, { transacting });

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
